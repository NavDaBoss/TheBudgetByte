// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg__3UrL0_d2NeoVDce0CxlJOaQYkbTIk",
  authDomain: "budgetbyte-d5bf8.firebaseapp.com",
  projectId: "budgetbyte-d5bf8",
  storageBucket: "budgetbyte-d5bf8.appspot.com",
  messagingSenderId: "386914039894",
  appId: "1:386914039894:web:312390060d4abd98e3e3f7"
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
      name: user.displayName || "Anonymous",
      email: user.email,
      provider: user.providerData[0].providerId
    });
  };

export { auth, provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, saveUserToFirestore };