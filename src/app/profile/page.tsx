'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { auth, signOut } from '../firebase/firebaseConfig'
import "./profile.css";

export default function Profile() {
  const router = useRouter();
  const logout = async () => {
    await signOut(auth);
    router.push("/login"); // Redirect to login
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Hey Display Name</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

