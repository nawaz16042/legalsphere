
"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, Auth, sendEmailVerification, updatePassword, EmailAuthProvider, sendPasswordResetEmail, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { app, db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

interface UserProfileData {
  fullName: string;
  phoneNumber: string;
  age: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, profileData: UserProfileData) => Promise<void>;
  logout: () => void;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  reauthenticateAndDeleteUser: (password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Directly initialize auth to ensure it's available early
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]); // Depend on auth to ensure subscription is correct


  const login = useCallback(async (email: string, pass: string) => {
    // No need for if (!auth) check here as auth is always initialized
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        if (!userCredential.user.emailVerified) {
            await signOut(auth);
            throw new Error("Please verify your email before logging in.");
        }
        router.push('/dashboard');
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            throw new Error("Invalid email or password. Please try again.");
        }
        throw error;
    }
  }, [auth, router]);

  const signup = useCallback(async (email: string, pass: string, profileData: UserProfileData) => {
    // No need for if (!auth) check here as auth is always initialized
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    
    const user = userCredential.user;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        ...profileData,
        createdAt: new Date(),
      });
    }

    await sendEmailVerification(userCredential.user);
    await signOut(auth);
  }, [auth]);

  const logout = useCallback(async () => {
    // No need for if (!auth) check here as auth is always initialized
    await signOut(auth);
    router.push('/login');
  }, [router, auth]);

  const changePassword = useCallback(async (currentPass: string, newPass: string) => {
    if (!user?.email) {
        throw new Error("You must be logged in to change your password.");
    }
    
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    
    await updatePassword(user, newPass);
  }, [user, auth]);

  const sendPasswordReset = useCallback(async (email: string) => {
    // No need for if (!auth) check here as auth is always initialized
    await sendPasswordResetEmail(auth, email);
  }, [auth]);

  const reauthenticateAndDeleteUser = useCallback(async (password: string) => {
    if (!user?.email) {
      throw new Error("You must be logged in to delete your account.");
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    
    await reauthenticateWithCredential(user, credential);

    const userId = user.uid;
    const batch = writeBatch(db);
    
    const userDocRef = doc(db, 'users', userId);
    batch.delete(userDocRef);

    await batch.commit();

    await deleteUser(user);
    
    router.push('/login');
  }, [user, auth, router]);

  const value = { user, loading, login, signup, logout, changePassword, sendPasswordReset, reauthenticateAndDeleteUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
