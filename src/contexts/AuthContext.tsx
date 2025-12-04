
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
  const [authInstance, setAuthInstance] = useState<Auth | null>(null); // Use a distinct name for the instance
  const router = useRouter();

  useEffect(() => {
    const firebaseAuth = getAuth(app);
    setAuthInstance(firebaseAuth);

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // Memoize functions, ensuring they only update when authInstance changes
  const login = useCallback(async (email: string, pass: string) => {
    if (!authInstance) {
      throw new Error("Auth service is not initialized.");
    }
    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, email, pass);
      if (!userCredential.user.emailVerified) {
        await signOut(authInstance);
        throw new Error("Please verify your email before logging in.");
      }
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        throw new Error("Invalid email or password. Please try again.");
      }
      throw error;
    }
  }, [authInstance, router]);

  const signup = useCallback(async (email: string, pass: string, profileData: UserProfileData) => {
    if (!authInstance) {
      throw new Error("Auth service is not initialized.");
    }
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, pass);
    
    const newUser = userCredential.user;
    if (newUser) {
      const userDocRef = doc(db, 'users', newUser.uid);
      await setDoc(userDocRef, {
        uid: newUser.uid,
        email: newUser.email,
        ...profileData,
        createdAt: new Date(),
      });
    }

    await sendEmailVerification(userCredential.user);
    await signOut(authInstance);
  }, [authInstance]);

  const logout = useCallback(async () => {
    if (!authInstance) {
      throw new Error("Auth service is not initialized.");
    }
    await signOut(authInstance);
    router.push('/login');
  }, [router, authInstance]);

  const changePassword = useCallback(async (currentPass: string, newPass: string) => {
    if (!authInstance || !user?.email || !user) {
      throw new Error("You must be logged in to change your password.");
    }
    
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    
    await updatePassword(user, newPass);
  }, [user, authInstance]);

  const sendPasswordReset = useCallback(async (email: string) => {
    if (!authInstance) {
      throw new Error("Auth service is not initialized.");
    }
    await sendPasswordResetEmail(authInstance, email);
  }, [authInstance]);

  const reauthenticateAndDeleteUser = useCallback(async (password: string) => {
    if (!authInstance || !user?.email || !user) {
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
  }, [user, authInstance, router]);

  const value = { user, loading, login, signup, logout, changePassword, sendPasswordReset, reauthenticateAndDeleteUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
