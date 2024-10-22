'use client';


import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();
  const user = useAuth();

    return (
      <div>
        <h1>Welcome to BudgetByte!!</h1>
        <p>Please log in or register to continue</p>
        <button onClick={() => router.push('/login')}>Log In</button> 
        <button onClick={() => router.push('/register')}>Register</button> 
        <button onClick={() => router.push('/profile')}>Profile</button> 
        <button onClick={() => router.push('/ocr')}>OCR</button> 
      </div>
    );

}
