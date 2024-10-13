'use client';

import { useState } from 'react';
import { auth, createUserWithEmailAndPassword, saveUserToFirestore } from '../firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import "./register.css"

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  const register = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(result.user, displayName); // Save user to Firestore
      router.push('/login'); // Redirect to login page
    } catch (error) {
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
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <h1>Email: </h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <h1>Password: </h1>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
    </div>
  );
}
