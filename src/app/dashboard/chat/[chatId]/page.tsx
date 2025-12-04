
"use client";

import * as React from 'react';
import { useState, useRef, FormEvent, useEffect, Suspense, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import { askLegalChatbot, getChatTitle, transcribeAudioAction } from '../../actions';
import { useChatHistory, Message } from '@/hooks/useChatHistory';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, SendHorizontal, User, Gavel, Smile, Frown, Annoyed, HelpCircle, FileText, Link as LinkIcon, StopCircle, Mic, Square, Paperclip, X, Pencil, Check, Ban, File, FileType } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useLocale } from '@/contexts/LocaleContext';
import Image from 'next/image';

const SentimentIcon = ({ sentiment }: { sentiment?: string }) => {
    if (!sentiment) return null;

    const sentimentLower = sentiment.toLowerCase();
    let icon = <HelpCircle className="h-4 w-4" />;
    if (sentimentLower.includes('curious')) {
        icon = <HelpCircle className="h-4 w-4 text-blue-500" />;
    } else if (sentimentLower.includes('anxious')) {
        icon = <Frown className="h-4 w-4 text-yellow-500" />;
    } else if (sentimentLower.includes('frustrated')) {
        icon = <Annoyed className="h-4 w-4 text-red-500" />;
    } else if (sentimentLower.includes('neutral')) {
        icon = <Smile className="h-4 w-4 text-green-500" />;
    }

    return (
        <Badge variant="outline" className="capitalize mt-2">
            {icon}
            <span className="ml-1">{sentiment}</span>
        </Badge>
    );
};

const promptSuggestions = [
    "What are my rights if I’m arrested without a warrant?",
    "How do I file a consumer complaint for a defective product?",
    "Explain the process of property registration in India.",
    "What is the procedure for divorce by mutual consent?",
];

function ChatPageContent({ chatId }: { chatId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { locale, t } = useLocale();
  
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const abortControllerRef = useRef<AbortController | null>(null);

  const { chats, saveChat, loading: historyLoading } = useChatHistory();

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [attachment, setAttachment] = useState<{dataUrl: string, name: string, type: 'image' | 'pdf'} | null>(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');

  // A ref to store the current chat ID. This helps manage state for new chats that don't have an ID yet.
  const activeChatIdRef = useRef(chatId);


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);


  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsTranscribing(true);
          try {
            const { text } = await transcribeAudioAction({ audio: base64Audio });
            setInput(text);
          } catch (error) {
            toast({
              title: "Transcription Failed",
              description: "Could not transcribe the audio. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsTranscribing(false);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const handleInitialQuery = useRef(async (query: string) => {
    if (query && chatId === 'new' && messages.length === 0) {
      setInput(query);
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 0);
    }
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if(file.type.startsWith('image/')) {
                setAttachment({dataUrl: reader.result as string, name: file.name, type: 'image'});
            } else if (file.type === 'application/pdf') {
                 setAttachment({dataUrl: reader.result as string, name: file.name, type: 'pdf'});
            } else {
                 toast({
                    title: "Unsupported File Type",
                    description: "Please upload an image or PDF file.",
                    variant: "destructive",
                })
            }
        }
        reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment({dataUrl: reader.result as string, name: file.name, type: 'image'});
            }
            reader.readAsDataURL(file);
        }
        e.preventDefault();
        return;
      }
    }
  }

  const removeAttachment = () => {
    setAttachment(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  useEffect(() => {
    const query = searchParams.get('q');
    if (chatId === 'new') {
      activeChatIdRef.current = 'new';
      setMessages([]);
      if (query) {
        handleInitialQuery.current(query);
      }
    } else {
      activeChatIdRef.current = chatId;
      const currentChat = chats.find(c => c.id === chatId);
      if (currentChat) {
        setMessages(currentChat.messages);
      }
    }
  }, [chatId, chats, searchParams]);


  useEffect(() => {
    if (scrollViewportRef.current) {
      setTimeout(() => {
        scrollViewportRef.current!.scrollTo({
          top: scrollViewportRef.current!.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
        formRef.current?.requestSubmit();
    }, 0)
  };
  
  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleEditClick = (index: number) => {
    setEditingMessageIndex(index);
    setEditedContent(messages[index].content);
  };

  const handleCancelEdit = () => {
    setEditingMessageIndex(null);
    setEditedContent('');
  };

  const handleSaveEdit = async () => {
    if (editingMessageIndex === null || !editedContent.trim()) return;

    const originalMessage = messages[editingMessageIndex];
    // Create a new branch of the conversation from the point of the edit
    const conversationBranch = messages.slice(0, editingMessageIndex);
    const updatedUserMessage: Message = { ...originalMessage, content: editedContent };

    setMessages([...conversationBranch, updatedUserMessage]);
    setEditingMessageIndex(null);
    setEditedContent('');
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
        const history = conversationBranch.map((m) => ({ role: m.role, content: m.content }));
        const result = await askLegalChatbot({ 
            query: editedContent, 
            history, 
            language: locale, 
            attachment: undefined // Editing does not preserve the original attachment for simplicity
        });

        if (!result) throw new Error("No response from chatbot.");
        
        const newAssistantMessage: Message = {
            role: 'assistant',
            content: result.answer,
            sentiment: result.sentiment,
            sources: result.sources,
        };

        const completeConversation = [...conversationBranch, updatedUserMessage, newAssistantMessage];
        setMessages(completeConversation);

        // Save the updated chat history
        await saveChat({
            id: activeChatIdRef.current,
            title: chats.find(c => c.id === activeChatIdRef.current)?.title || "Chat",
            messages: completeConversation,
            timestamp: Date.now()
        }, false);


    } catch (error) {
       if (error instanceof Error && error.name === 'AbortError') {
          toast({
            title: 'Request Cancelled',
            description: 'The chat request was cancelled successfully.',
          });
          // Revert to the state before edit
          setMessages(messages);
      } else {
          console.error(error);
          toast({
            title: 'An error occurred',
            description: 'Failed to get a response. Please try again.',
            variant: 'destructive',
          });
          // Revert to the state before edit
          setMessages(messages);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

 const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentQuery = input;
    const isNewChat = activeChatIdRef.current === 'new';

    const newUserMessage: Message = { role: 'user', content: currentQuery };
    
    // Optimistically update the UI
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setAttachment(null);
     if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const history = isNewChat ? [] : messages.map((m) => ({ role: m.role, content: m.content }));

      const result = await askLegalChatbot(
        { query: currentQuery, history, language: locale, attachment: attachment?.dataUrl }
      );

      if (!result) {
          throw new Error("No response from chatbot.");
      }

      const newAssistantMessage: Message = {
        role: 'assistant',
        content: result.answer,
        sentiment: result.sentiment,
        sources: result.sources,
      };
      
      const completeConversation = [...updatedMessages, newAssistantMessage];
      setMessages(completeConversation);

      if (isNewChat) {
        const newChatId = uuidv4();
        const title = await getChatTitle({ advice: result.answer, language: locale });
        await saveChat({ id: newChatId, title, messages: completeConversation, timestamp: Date.now() }, true);
        router.replace(`/dashboard/chat/${newChatId}`, { scroll: false });
        activeChatIdRef.current = newChatId;
      } else {
        await saveChat({
            id: activeChatIdRef.current,
            title: chats.find(c => c.id === activeChatIdRef.current)?.title || "Chat",
            messages: completeConversation,
            timestamp: Date.now()
        }, false);
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
          toast({
            title: 'Request Cancelled',
            description: 'The chat request was cancelled successfully.',
          });
          setMessages(messages => messages.slice(0, -1));
      } else {
          console.error(error);
          toast({
            title: 'An error occurred',
            description: 'Failed to get a response. Please try again.',
            variant: 'destructive',
          });
          setMessages(messages => messages.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };
  
  const PageLoader = () => (
    <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  if (historyLoading && chatId !== 'new') {
      return <PageLoader />;
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full" viewportRef={scrollViewportRef}>
          <div className="prose-sm md:prose-base max-w-none space-y-6 pr-4">
            {messages.length === 0 && !isLoading ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8">
                 <Gavel className="w-16 h-16 mb-4 text-primary" />
                 <h2 className="text-2xl font-semibold text-foreground">{t('welcomeToLegalSphere')}</h2>
                 <p className="mb-6">{t('welcomeDescription')}</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {promptSuggestions.map((prompt, i) => (
                        <Card key={i} className="p-4 text-left hover:bg-muted cursor-pointer" onClick={() => handleSuggestionClick(prompt)}>
                            <p className="font-semibold text-foreground">{prompt}</p>
                        </Card>
                    ))}
                 </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`group flex items-start gap-4 ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-2xl rounded-lg p-4 shadow-sm flex flex-col ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card'
                    }`}
                  >
                    {editingMessageIndex === index ? (
                        <div className="space-y-2">
                           <Textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full bg-background text-foreground"
                                rows={Math.max(3, editedContent.split('\n').length)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit} disabled={isLoading}>
                                    <Ban className="mr-1 h-4 w-4" /> Cancel
                                </Button>
                                <Button size="sm" onClick={handleSaveEdit} disabled={isLoading || !editedContent.trim()}>
                                    {isLoading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />}
                                    Save & Submit
                                </Button>
                            </div>
                        </div>
                    ) : (
                         <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                             components={{
                                 a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />,
                                 ul: ({node, ...props}) => <ul className="list-disc ml-5" {...props} />,
                                 li: ({node, ...props}) => <li className="my-1" {...props} />
                             }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                     {message.role === 'assistant' && (
                        <div className="flex items-end justify-between mt-4 gap-4">
                            {message.sources && message.sources.length > 0 && (
                                <div className='w-full'>
                                    <h4 className="font-semibold flex items-center gap-2"><FileText size={16} /> {t('sources')}</h4>
                                    <ul className="list-none p-0 mt-2 space-y-1">
                                        {message.sources.map((source, i) => (
                                            <li key={i}>
                                                <Link href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2">
                                                    <LinkIcon size={12}/>
                                                    {source.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                             <div className="flex flex-col items-end">
                                {message.sentiment && <SentimentIcon sentiment={message.sentiment} />}
                             </div>
                        </div>
                     )}
                  </div>
                  {message.role === 'user' && editingMessageIndex !== index && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleEditClick(index)}
                            disabled={isLoading}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Avatar className="h-8 w-8 border">
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                    </div>
                  )}
                </div>
              ))
            )}
             {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="max-w-xl rounded-lg p-3 shadow-sm bg-card flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 pt-0">
        <Card className="relative">
          <CardContent className="p-2">
            {attachment && (
                <div className="relative group p-2">
                    {attachment.type === 'image' ? (
                         <Image src={attachment.dataUrl} alt="Attachment preview" width={80} height={80} className="rounded-md object-cover"/>
                    ) : (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                            <FileType className="h-6 w-6 text-primary" />
                            <span className="text-sm text-muted-foreground truncate max-w-xs">{attachment.name}</span>
                        </div>
                    )}
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={removeAttachment}
                    >
                        <X className="h-3 w-3"/>
                    </Button>
                </div>
            )}
            <form ref={formRef} onSubmit={handleSubmit} className="flex items-end gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
              <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isRecording || isTranscribing}>
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
              </Button>
              <Textarea
                placeholder={t('chatPlaceholder')}
                className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
                rows={1}
                disabled={isLoading || isRecording || isTranscribing || editingMessageIndex !== null}
              />
                <Button type="button" size="icon" variant={isRecording ? "destructive" : "ghost"} onClick={handleMicClick} disabled={isLoading || isTranscribing || editingMessageIndex !== null}>
                    {isTranscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : (isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />)}
                    <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
                </Button>

              {isLoading ? (
                  <Button type="button" size="icon" variant="destructive" onClick={handleCancelRequest}>
                      <StopCircle className="h-4 w-4" />
                      <span className="sr-only">Stop Generation</span>
                  </Button>
              ) : (
                  <Button type="submit" size="icon" disabled={!input.trim() || editingMessageIndex !== null}>
                      <SendHorizontal className="h-4 w-4" />
                      <span className="sr-only">{t('send')}</span>
                  </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;

  // Use a key to force re-mounting when the chatId changes. This is a robust way to reset state.
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <ChatPageContent key={chatId} chatId={chatId} />
    </Suspense>
  )
}
