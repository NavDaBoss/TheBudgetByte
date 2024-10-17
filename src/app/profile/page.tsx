'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, signOut, updateProfile, doc, setDoc } from '../firebase/firebaseConfig'
import "./profile.css";

export default function Profile() {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const logout = async () => {
    await signOut(auth);
    router.push("/login"); // Redirect to login
  };

  const [isEditing, setIsEditing] = useState(false); // Control the pop-up state
  const [newName, setNewName] = useState(''); // State for the new name

  const handleNameChange = async (event) => {
    setNewName(event.target.value); // Update the new name as user types
}

  const handleEditClick = () => {
    setIsEditing(true); // Show the pop-up
  };

  const handleUpdateName = async () => {
    if (newName && currentUser !== null) {
      try {
        await updateProfile(currentUser, {
          displayName: newName, // Set the new displayName here
        });
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, { displayName: newName }, { merge: true });
        setIsEditing(false); // Hide the pop-up after updating
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleHomePage = async () => {
    router.push("./");
  }
  return (
    <div>
      <h1>Profile</h1>
      {currentUser ? <p>Hey {currentUser.displayName || "User"}</p> : <p>"User"</p>}
      {currentUser ? <p>Email: {currentUser.email || "N/A"}</p> : <p>"N/A"</p>}
      <button onClick={handleEditClick}>Edit Name</button>
      <button onClick={handleHomePage}>Return to Home Page</button>
      <button onClick={logout}>Logout</button>
      {/* Pop-up for editing the name */}
      {isEditing && (
        <div className="popup">
          <h3>Enter a new name</h3>
          <input
            type="text"
            value={newName}
            onChange={handleNameChange}
            placeholder="New name"
          />
          <button onClick={handleUpdateName}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

