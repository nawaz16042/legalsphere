
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


  const saveChat = useCallback(async (chatToSave: Omit<Chat, 'timestamp'> & { timestamp?: number }, isNewChat: boolean) => {
    if (!user || !settings.storeHistory) return;

    const { id, ...chatData } = chatToSave;
    const chatDocRef = doc(db, 'users', user.uid, 'chats', id);
    
    try {
      await setDoc(chatDocRef, {
        ...chatData,
        timestamp: Timestamp.fromMillis(chatToSave.timestamp || Date.now())
      }, { merge: true });

      // Increment the prompt count only when a new message is added
      if (isNewChat || chatToSave.messages.length > (chats.find(c => c.id === id)?.messages.length || 0)) {
        await incrementPromptCount(user.uid);
      }

    } catch (error) {
      console.error('Failed to save chat history to Firestore', error);
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
