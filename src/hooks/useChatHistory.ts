
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

  // Helper function to conditionally increment prompt count
  const guardedIncrementPromptCount = useCallback(async () => {
    if (user && user.uid) {
      try {
        await incrementPromptCount(user.uid);
      } catch (error) {
        console.error("Failed to increment prompt count:", error);
      }
    } else {
      console.warn("Attempted to increment prompt count without an authenticated user. This action was prevented.");
    }
  }, [user]);

  // TODO: Replace any direct calls to `incrementPromptCount(user.uid)`
  // with `guardedIncrementPromptCount()` where applicable in this file or related components.
  // For example, after a successful chat message submission or AI response.

  // Your existing logic for fetching, adding, updating, and deleting chats would go here.
  // This snippet only focuses on the prompt count issue.

  return { chats, loading, guardedIncrementPromptCount /* ... other return values */ };
};
