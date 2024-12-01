'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  saveUserToFirestore,
  sendPasswordResetEmail,
} from '../firebase/firebaseConfig';
import { FirebaseError } from '@firebase/app';
import './login.css';
import Image from 'next/image';

/**
 * Login Page:
 * This page handles the user login process, including Google sign-in,
 *  forgot password reset email, and navigation to the dashboard page.
 * @return {React.JSX.Element} The rendered login form page.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordResetMessage, setpasswordResetMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const router = useRouter();
  const currentUser = auth.currentUser;

  // Redirect to dashboard if the user is already logged in
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

  /**
   * Handles Google sign-in using Firebase Authentication.
   * - On successful login, saves the user to Firestore and redirects to the dashboard.
   */
  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles email and password login using Firebase Authentication.
   * - On successful login, redirects the user to the dashboard.
   * - Otherwise, displays an error message informing the user that their credentials are invalid.
   */
  const login = async () => {
    try {
      setErrorMessage('');
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage('Invalid Email or Password. Please try again.');
      }
    }
  };

  /**
   * Sends a password reset email to the provided address using Firebase Authentication.
   * - Displays a success or error message based on the operation result.
   */
  const forgotPassword = async () => {
    try {
      if (resetEmail !== null) {
        await sendPasswordResetEmail(auth, resetEmail);
        setpasswordResetMessage('Password reset email sent. Check your inbox.');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error sending password reset email. Please try again.');
    }
  };

  return (
    <div className="main">
      <h1
        className="header-logo"
        onClick={() => router.push('/')}
        style={{ cursor: 'pointer' }}
      >
        Budget Byte
      </h1>
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
      <Link
        href="#"
        className="forgot-password-link"
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
      >
        Forgot Password?
      </Link>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {passwordResetMessage && (
        <p className="success-message">{passwordResetMessage}</p>
      )}
      <button onClick={login} className="login">
        Login
      </button>
      <div className="or-separator">Or</div>
      <div className="google-sign-in-container">
        <Image
          src="/assets/continue_with_google.svg"
          alt="Continue with Google"
          width={236.562}
          height={50}
          onClick={googleSignIn}
          className="google-sign-in"
        />
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-pwd">
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
            <div className="button-container">
              <button onClick={forgotPassword}>Send Reset Email</button>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="title-line"></div>
      <div className="register-container">
        <p>New to Budget Byte?</p>
        <Link href="/register" className="register-link">
          Create an account
        </Link>
      </div>
    </div>
  );
}
