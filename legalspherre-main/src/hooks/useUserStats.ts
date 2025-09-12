
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, increment, getDoc } from 'firebase/firestore';

interface UserStats {
    dailyPromptCount: number;
}

const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

// This function can be called from server actions or client components safely
export const incrementPromptCount = async (userId: string) => {
    const todayStr = getTodayDateString();
    const usageDocRef = doc(db, 'users', userId, 'usage', todayStr);
    
    try {
        await setDoc(usageDocRef, {
            promptCount: increment(1)
        }, { merge: true });
    } catch (error) {
        console.error("Failed to increment prompt count:", error);
    }
};

export const useUserStats = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats>({ dailyPromptCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const todayStr = getTodayDateString();
        const usageDocRef = doc(db, 'users', user.uid, 'usage', todayStr);

        const unsubscribe = onSnapshot(usageDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setStats({ dailyPromptCount: docSnap.data().promptCount || 0 });
            } else {
                setStats({ dailyPromptCount: 0 });
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching user stats:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return { stats, loading };
};
