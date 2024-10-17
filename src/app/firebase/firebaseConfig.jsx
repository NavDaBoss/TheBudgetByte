// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore

// Function to save user data in Firestore
const saveUserToFirestore = async (user) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      email: user.email,
      provider: user.providerData[0].providerId || "email"
    });
  };

export const storage = getStorage(app);
export { auth, provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, saveUserToFirestore, updateProfile, getAuth, db, setDoc, doc, sendPasswordResetEmail };