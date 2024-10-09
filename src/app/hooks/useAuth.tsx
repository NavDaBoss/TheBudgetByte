import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig'; 
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // Handle both 'User' and 'null' types

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Automatically sets user or null
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  return user; // Return the user state
};