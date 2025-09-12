
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
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const login = useCallback(async (email: string, pass: string) => {
    if (!auth) {
        throw new Error("Auth service is not initialized.");
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        if (!userCredential.user.emailVerified) {
            await signOut(auth);
            throw new Error("Please verify your email before logging in.");
        }
        router.push('/dashboard');
    } catch (error: any) {
        // We catch the error here, but re-throw it so the UI can display a toast.
        // This prevents any incorrect redirects and provides clear user feedback.
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            throw new Error("Invalid email or password. Please try again.");
        }
        // Re-throw any other errors (like the email verification error) as is.
        throw error;
    }
  }, [auth, router]);

  const signup = useCallback(async (email: string, pass: string, profileData: UserProfileData) => {
    if (!auth) return;
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Save additional user data to Firestore
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
    // Log the user out immediately so they have to verify first.
    await signOut(auth);
  }, [auth]);

  const logout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  }, [router, auth]);

  const changePassword = useCallback(async (currentPass: string, newPass: string) => {
    if (!auth || !user?.email) {
        throw new Error("You must be logged in to change your password.");
    }
    
    // Re-authenticate the user
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    
    // If re-authentication is successful, update the password
    await updatePassword(user, newPass);
  }, [user, auth]);

  const sendPasswordReset = useCallback(async (email: string) => {
    if (!auth) return;
    await sendPasswordResetEmail(auth, email);
  }, [auth]);

  const reauthenticateAndDeleteUser = useCallback(async (password: string) => {
    if (!auth || !user?.email) {
      throw new Error("You must be logged in to delete your account.");
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    
    // Re-authenticate to confirm identity
    await reauthenticateWithCredential(user, credential);

    // After successful re-authentication, delete user data and account
    const userId = user.uid;
    const batch = writeBatch(db);
    
    // Delete user document from 'users' collection
    const userDocRef = doc(db, 'users', userId);
    batch.delete(userDocRef);

    // Delete usage data (assuming it's stored in a subcollection)
    // Note: Deleting subcollections from the client is complex.
    // This example deletes the main user doc. For full cleanup,
    // a Cloud Function is recommended to delete subcollections.

    await batch.commit();

    // Finally, delete the user from Firebase Auth
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
