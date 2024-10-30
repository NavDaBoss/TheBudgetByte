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
import Navbar from '../components/Navbar';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();

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
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, {
        displayName: displayName, // Set the displayName here
      });

      await saveUserToFirestore(result.user); // Save user to Firestore
      router.push('/login'); // Redirect to login page
    } catch (error) {
      if (password === confirmPassword && password.length >= 6) {
        setErrorMessage('Email is not valid or already in use.');
      }
      console.error(error);
    }
  };

  return (
    <div className="main">
      <Navbar />
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
      <button onClick={register} className="register">Register</button>
      {errorMessage && <p>{errorMessage}</p>}
      <div className="title-line"></div>
      <div className="login-container">
        <p>Already have an account?</p>
        <Link href="/login" className="login-link">
          Continue to Login
        </Link>
      </div>
    </div>
  );
}
