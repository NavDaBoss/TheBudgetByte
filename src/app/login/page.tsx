'use client';

import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { auth, provider, signInWithPopup, signInWithEmailAndPassword, saveUserToFirestore, sendPasswordResetEmail } from '../firebase/firebaseConfig';
import { FirebaseError } from '@firebase/app';
import "./login.css"


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const [passwordResetMessage, setpasswordResetMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("");
  const router = useRouter();

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user); // Save user to Firestore
      router.push("/profile");
    } catch (error) {
      console.error(error);
    }
  };


  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/profile");
    } catch (error) {
      if (error instanceof FirebaseError){
          setErrorMessage('Invalid Email or Password. Please try again.');
      }
      
    }
  };

  const forgotPassword = async() => {
    try {
      if(resetEmail !== null){
        await sendPasswordResetEmail(auth, resetEmail);
        setpasswordResetMessage("Password reset email sent. Check your inbox.");
        setIsModalOpen(false);

      }
    
    } catch (error) {
      console.error(error);
      setErrorMessage("Error sending password reset email. Please try again.");
    }
  };



  return (
    <div className="main">
      <h1>Login</h1>
      <div className="title-line"></div>
      <div className="login-container">
        <div className="email">
          <h2>Email:</h2>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="password">
          <h2>Password:</h2>
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button onClick={login}>Login</button>
      <h3>Forgot your Password?</h3>
      <button onClick={() => setIsModalOpen(true)}>Forgot Password</button>
      <div className="title-line"></div>
      <div onClick={googleSignIn}>
        <img src="/assets/continue_with_google.svg" alt="Continue with Google" />
      </div>
      
      {passwordResetMessage && <p>{passwordResetMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
      {isModalOpen && (
        <div className="popup">
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button onClick={forgotPassword}>Send Reset Email</button>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
      <div className="title-line"></div>
      <h3>New to Budget Byte?</h3>
      <Link href="/register">
        <button>Register</button>
      </Link>
    </div>
  );
}
