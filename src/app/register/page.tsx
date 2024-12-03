'use client';

import { useState } from 'react';
import {
  auth,
  createUserWithEmailAndPassword,
  saveUserToFirestore,
  updateProfile,
} from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './register.css';
import Image from 'next/image';
import Footer from '../components/Footer';
/**
 * Register Page:
 * This page handles the user registration process, including form input,
 * validation, Firebase user creation, and navigation to the login page.
 *  @return {React.JSX.Element} The rendered registration form page.
 */
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [successRegisterMessage, setSuccessRegisterMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();

  /**
   * Handles user registration.
   * - Validates whether the password matches the confirm password, length, and display name constraints.
   * - Creates a new user in Firebase Authentication.
   * - Saves the user to Firestore with a display name.
   * - Redirects to the login page and into BudgetByte after a successful registration.
   * - Displays useful error messages informing the user exactly why the registration fails.
   * - Displays a success message once the registration goes through.
   */
  const register = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        throw new Error('Passwords do not match.');
      }
      if (password.length < 6 || confirmPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        throw new Error('Password must be at least 6 characters long.');
      }
      if (displayName.length > 20) {
        setErrorMessage('The Display Name cannot exceed 20 characters.');
        throw new Error('The Display Name cannot exceed 20 characters.');
      }

      setErrorMessage('');
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, {
        displayName: displayName,
      });

      await saveUserToFirestore(result.user);
      setSuccessRegisterMessage('New User Created!');
      setTimeout(() => {
        setSuccessRegisterMessage('');
        router.push('/login');
      }, 2000);
    } catch (error) {
      if (displayName.length > 20) {
        setErrorMessage('The Display Name cannot exceed 20 characters.');
      } else if (password === confirmPassword && password.length >= 6) {
        setErrorMessage('Email is not valid or already in use.');
      }
      console.error(error);
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
      <h1>Register</h1>
      <div className="title-line"></div>
      <div className="input-container">
        <Image
          src="/assets/display_name_icon.svg"
          alt="Display Name Icon"
          width={20}
          height={22.5}
          className="display-name-icon"
        />
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          required
          onChange={(e) => setDisplayName(e.target.value)}
          className="display-name-input"
        />
      </div>
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
          required
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
          autoComplete="new-password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
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
          placeholder="Confirm Password"
          value={confirmPassword}
          autoComplete="off"
          required
          onChange={(e) => setconfirmPassword(e.target.value)}
          className="password-input"
        />
      </div>
      <button onClick={register} className="register">
        Register
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successRegisterMessage && (
        <p className="success-message">{successRegisterMessage}</p>
      )}
      <div className="title-line"></div>
      <div className="login-container">
        <p>Already have an account?</p>
        <Link href="/login" className="login-link">
          Continue to Login
        </Link>
      </div>
      <Footer />
    </div>
  );
}
