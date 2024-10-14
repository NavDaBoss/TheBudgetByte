'use client';

import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider, signInWithPopup, signInWithEmailAndPassword, saveUserToFirestore } from '../firebase/firebaseConfig';
import { FirebaseError } from '@firebase/app';
import "./login.css"


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter();




  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/profile'); // Redirect to profile
    } catch (error) {
      if (error instanceof FirebaseError){
          setErrorMessage('Invalid Email or Password. Please try again.');
      }
      
    }
  };


  return (
    <div>
      <h1>Email:</h1>
      <input
        type="email"
        placeholder="Enter your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <h1>Password:</h1>
      <input
        type="password"
        placeholder="Enter your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      {errorMessage && <p>{errorMessage}</p>}
      <h1>New to Budget Byte?</h1>
      <button onClick={()=>router.push('/register')}>Register</button>
    </div>
  );
}
