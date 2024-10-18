'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, signOut, updateProfile, doc, setDoc, storage } from '../firebase/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./profile.css";

export default function Profile() {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const logout = async () => {
    await signOut(auth);
    router.push("/login"); // Redirect to login
  };

  const [isEditingName, setIsEditingName] = useState(false); // Control the pop-up state
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [newName, setNewName] = useState(''); // State for the new name
  const [newProfilePic, setNewProfilePic] = useState(null); // State for profile picture
  const [profilePicUrl, setProfilePicUrl] = useState('');

  const handleNameChange = async (event) => {
    setNewName(event.target.value); // Update the new name as user types
  }

  // Handle image file selection
  const handleProfilePicChange = (event) => {
    if (event.target.files[0]) {
      setNewProfilePic(event.target.files[0]);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (currentUser && newProfilePic) {
      try {
        // Upload the profile picture to Firebase Storage
        const picRef = ref(storage, `profilePics/${currentUser.uid}`);
        await uploadBytes(picRef, newProfilePic);
        const imageUrl = await getDownloadURL(picRef);

        // Update the user's profile
        await updateProfile(currentUser, {
          displayName: newName || currentUser.displayName,
          photoURL: imageUrl, // Update profile with image URL
        });

        // Save data to Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, { displayName: newName, photoURL: imageUrl }, { merge: true });

        // Update the state to reflect the new profile picture URL
        setProfilePicUrl(imageUrl);
        setIsEditingPic(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleEditName = () => {
    setIsEditingName(true); // Show the pop-up
  };

  const handleEditProliePic = () => {
    setIsEditingPic(true); // Show the profile pic pop-up
  };

  const handleUpdateName = async () => {
    if (newName && currentUser !== null) {
      try {
        await updateProfile(currentUser, {
          displayName: newName, // Set the new displayName here
        });
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, { displayName: newName }, { merge: true });
        setIsEditingName(false); // Hide the pop-up after updating
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
      {/* Display profile picture */}
      <div>
        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        ) : (
          <p>No Profile Picture</p>
        )}
      </div>

      <button onClick={handleEditName}>Edit Name</button>
      <button onClick={handleEditProliePic}>Upload Image</button>
      <button onClick={handleHomePage}>Return to Home Page</button>
      <div><button onClick={logout}>Logout</button></div>

      {/* Pop-up for editing profile name */}
      {isEditingName && (
        <div className="popup">
          <h3>Edit Profile Name</h3>
          <input
            type="text"
            value={newName}
            onChange={handleNameChange}
            placeholder="New name"
          />
          <button onClick={handleUpdateName}>Save</button>
          <button onClick={() => setIsEditingName(false)}>Cancel</button>
        </div>
      )}
      {isEditingPic && (
        <div className="popup">
          <h3>Edit Profile Pic</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
          <button onClick={handleUpdateProfile}>Save</button>
          <button onClick={() => setIsEditingPic(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

