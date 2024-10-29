'use client';

import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { auth, provider, signInWithPopup, signInWithEmailAndPassword, saveUserToFirestore, sendPasswordResetEmail } from '../firebase/firebaseConfig';
import { FirebaseError } from '@firebase/app';
import "./login.css"
import Image from "next/image";


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
      <div className="input-container">
        <Image
        src="/assets/email_icon.svg"
        alt="Email Icon"
        width={20}
        height={22.5}
        className="email-icon"
         />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
      </div>
      <div className="input-container">
        <Image
          src="/assets/lock_icon.svg"
          alt="Lock Icon"
          width={20}
          height={22.5}
          className="lock-icon"
          />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
        
      </div>
      <Link href="#" className="forgot-password-link" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
        Forgot Password?
      </Link>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {passwordResetMessage && <p className="success-message">{passwordResetMessage}</p>}
      <button onClick={login} className="login">
        Login
      </button>
      <div className="or-separator">Or</div>
      <div className="google-sign-in-container">
        <img src="/assets/continue_with_google.svg" alt="Continue with Google" onClick={googleSignIn} className="google-sign-in"/>
      </div>
      
      
      {isModalOpen && (
        <div className="modal-overlay">
        <div className="modal-content">
          <h2>Reset Password</h2>
          <div className="input-container">
            <Image
              src="/assets/email_icon.svg"
              alt="Email Icon"
              width={20}
              height={22.5}
              className="email-icon"
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>
          <button onClick={forgotPassword}>Send Reset Email</button>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      </div>
      )}
      <div className="title-line"></div>
      <div className="register-container">
        <p>New to Budget Byte?</p>
        <Link href="/register" className="register-link">
          Create a BudgetByte Account
        </Link>
      </div>
      
    </div>
  );
}
