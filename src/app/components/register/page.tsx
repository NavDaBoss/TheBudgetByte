'use client';

import { useState } from 'react';
import { auth, createUserWithEmailAndPassword, saveUserToFirestore, updateProfile } from '../../firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import "./register.css"

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  const register = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        throw new Error("Passwords do not match.");
      }
      if (password.length < 6 || confirmPassword.length < 6){
        setErrorMessage("Password must be at least 6 characters long.");
        throw new Error("Password must be at least 6 characters long.")
      }
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, {
        displayName: displayName, // Set the displayName here
      });

      await saveUserToFirestore(result.user); // Save user to Firestore
      router.push('/login'); // Redirect to login page
    } catch (error) {
      if(password === confirmPassword && password.length >= 6){
        setErrorMessage("Email is not valid or already in use.")
      }
      console.error(error);
    }
  };


  return (
    <div>
      <h1>Register</h1>
      <h1>Display Name:</h1>
      <input
        type="text"
        placeholder="Display Name" 
        value={displayName}
        required
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <h1>Email: </h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <h1>Password: </h1>
      <input
        type="password"
        placeholder="Password"
        value={password}
        autoComplete='new-password'
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <h1>Confirm Password: </h1>
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        autoComplete='off'
        required
        onChange={(e) => setconfirmPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
      {errorMessage && <p>{errorMessage}</p>}
      <h1>Already have an account?</h1>
      <Link href="/login">
        <button>Continue to Login</button>
      </Link>
    </div>
  );
}
