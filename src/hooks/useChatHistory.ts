
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from './useAuth';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, orderBy, query, setDoc, deleteDoc, getDoc, Timestamp } from 'firebase/firestore';
import { incrementPromptCount } from './useUserStats';

// Define types for chat and messages
type Source = {
  title: string;
  url: string;
};

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  sentiment?: string;
  sources?: Source[];
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Timestamp;
};

export type FirestoreChat = Omit<Chat, 'timestamp'> & { timestamp: Timestamp };

export const useChatHistory = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !settings.storeHistory) {
      setChats([]);
      setLoading(false);
      return;
    }

    const chatsColRef = collection(db, 'users', user.uid, 'chats');
    const q = query(chatsColRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userChats = snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreChat;
        return {
          ...data,
          id: doc.id,
        }
      });
      setChats(userChats);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chat history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, settings.storeHistory]);

  const getChat = useCallback(async (chatId: string): Promise<Chat | undefined> => {
    if (!user || !settings.storeHistory) return undefined;

    const chatDocRef = doc(db, 'users', user.uid, 'chats', chatId);
    try {
      const docSnap = await getDoc(chatDocRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Chat;
      }
      return undefined;
    } catch (error) {
      console.error("Error getting single chat:", error);
      return undefined;
    }
  }, [user, settings.storeHistory]);


  const saveChat = useCallback(async (chatToSave: Omit<Chat, 'timestamp' | 'id'> & { id?: string, timestamp?: number }, isNewChat: boolean): Promise<string | undefined> => {
    if (!user || !settings.storeHistory) return;

    let chatId = chatToSave.id;

    if (isNewChat || !chatId) { // Generate new ID if it's a new chat or no ID is provided
      chatId = doc(collection(db, 'users', user.uid, 'chats')).id;
    }

    if (!chatId) {
      console.error("Failed to generate chat ID.");
      return undefined;
    }

    const chatDocRef = doc(db, 'users', user.uid, 'chats', chatId);

    // Sanitize messages to remove undefined fields before saving
    const sanitizedMessages = chatToSave.messages.map(message => {
      const newMessage: Message = { role: message.role, content: message.content };
      if (message.sentiment !== undefined) {
        newMessage.sentiment = message.sentiment;
      }
      if (message.sources !== undefined && message.sources.length > 0) {
        newMessage.sources = message.sources;
      }
      return newMessage;
    });
    
    try {
      await setDoc(chatDocRef, {
        ...chatToSave,
        messages: sanitizedMessages,
        timestamp: Timestamp.fromMillis(chatToSave.timestamp || Date.now()),
        id: chatId // Ensure the ID is explicitly set in the document
      }, { merge: true });

      // Increment the prompt count only when a new message is added,
      // or if it's a brand new chat (which implies a first message)
      if (isNewChat || chatToSave.messages.length > (chats.find(c => c.id === chatId)?.messages.length || 0)) {
        await incrementPromptCount(user.uid);
      }
      return chatId; // Return the ID of the saved chat
    } catch (error) {
      console.error('Failed to save chat history to Firestore', error);
      return undefined;
    }
  }, [user, settings.storeHistory, chats]);


  const deleteChat = useCallback(async (chatId: string) => {
    if (!user || !settings.storeHistory) return;

    const chatDocRef = doc(db, 'users', user.uid, 'chats', chatId);
    try {
        await deleteDoc(chatDocRef);
    } catch(error) {
        console.error("Error deleting chat from Firestore:", error);
    }
  }, [user, settings.storeHistory]);


  return { chats, loading, getChat, saveChat, deleteChat };
};
