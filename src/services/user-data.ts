
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export interface UserProfile {
    uid: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    age: number;
    profilePictureUrl?: string;
    createdAt: any;
}

export async function getUserData(uid: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, 'users', uid);
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

export async function updateUserData(uid: string, data: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>) {
    const userDocRef = doc(db, 'users', uid);
    try {
        // Using setDoc with merge:true is safer. It updates if the doc exists, 
        // and creates it if it doesn't, preventing the "No document to update" error.
        await setDoc(userDocRef, data, { merge: true });
    } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
    }
}

export async function uploadProfilePicture(uid: string, file: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${uid}/${file.name}`);
    
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;
    }
}

export async function deleteProfilePicture(uid: string) {
    const storage = getStorage();
    const userDoc = await getUserData(uid);
    if (userDoc?.profilePictureUrl) {
        try {
            const pictureRef = ref(storage, userDoc.profilePictureUrl);
            await deleteObject(pictureRef);
            await updateUserData(uid, { profilePictureUrl: '' });
        } catch (error) {
            // It's possible the file doesn't exist, so we can ignore not found errors
            if ((error as any).code !== 'storage/object-not-found') {
                 console.error("Error deleting profile picture from storage:", error);
                 throw error;
            }
        }
    }
}
