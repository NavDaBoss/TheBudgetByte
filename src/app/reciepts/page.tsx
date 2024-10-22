'use client';

import React, { useEffect, useState } from 'react';
import { auth, db, storage } from "../firebase/firebaseConfig"; // Adjust the path if necessary
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

const Receipts = () => {
  const [receiptUrls, setReceiptUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Store the user in state

  useEffect(() => {

    // Listen for auth state changes and update currentUser when available
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // Set the user if authenticated
      } else {
        setLoading(false); // Stop loading if no user is logged in
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  useEffect(() => {
    const fetchReceipts = async () => {
      // If there's no currentUser, don't proceed
      if (!currentUser) return;

      setLoading(true);
      try {
        //gs://budgetbyte-d5bf8.appspot.com
        const storageRef = ref(storage, `/userReciepts/${currentUser.uid}`); //${currentUser.uid}

        const result = await listAll(storageRef);

        const urls = await Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
        setReceiptUrls(urls);
      } catch (error) {
        console.error("Error fetching receipt images:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchReceipts();
    }
  }, [currentUser]); // Trigger the effect when currentUser is set

  if (loading) {
    return <p>Loading receipts...</p>;
  }

  return (
    <div>
      <h1>Receipts</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {receiptUrls.length > 0 ? (
          receiptUrls.map((url, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '10px' }}>
              <img src={url} alt={`Receipt ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
            </div>
          ))
        ) : (
          <p>No receipts found.</p>
        )}
      </div>
    </div>
  );
};

export default Receipts;
