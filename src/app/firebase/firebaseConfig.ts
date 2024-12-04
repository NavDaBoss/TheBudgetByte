// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Firestore, getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore
import { getStorage, Storage } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Your web app's Firebase configuration
export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db: Firestore = getFirestore(app); // Initialize Firestore

// Function to save user data in Firestore
const saveUserToFirestore = async (user: firebase.User): Promise<void> => {
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    displayName: user.displayName || 'Anonymous',
    email: user.email,
    provider: user.providerData[0].providerId || 'email',
  });
};

export const storage: Storage = getStorage(app);
export {
  auth,
  provider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  saveUserToFirestore,
  updateProfile,
  getAuth,
  db,
  setDoc,
  doc,
  sendPasswordResetEmail,
};
