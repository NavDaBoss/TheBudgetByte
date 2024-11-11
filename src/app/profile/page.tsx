'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  auth,
  db,
  updateProfile,
  doc,
  setDoc,
  storage,
} from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './profile.css';
import Navbar from '../components/Navbar';
import SummaryPie from '../components/SummaryPie';
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Profile() {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const [receiptCount, setReceiptCount] = useState<number>(0);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      const fetchReceiptCount = async () => {
        try {
          const receiptsRef = collection(db, 'receiptData');
          const q = query(receiptsRef, where('userID', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          setReceiptCount(querySnapshot.size);
        } catch (error) {
          console.error('Error fetching receipt count:', error);
        }
      };
      fetchReceiptCount();
    }
  }, [currentUser, router]);

  const [isEditingName, setIsEditingName] = useState(false); // Control the pop-up state
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [newName, setNewName] = useState(''); // State for the new name
  const [newProfilePic, setNewProfilePic] = useState(null); // State for profile picture
  const [errorMessage, setErrorMessage] = useState('');

  const mockPieData = [
    { name: 'Fruits', value: 30 },
    { name: 'Veggies', value: 20 },
    { name: 'Grains', value: 25 },
    { name: 'Proteins', value: 15 },
    { name: 'Dairy', value: 10 },
  ];

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value); // Update the new name as user types
  };

  const handleClearNane = () => {
    setNewName('');
  };

  // Handle image file selection
  const handleProfilePicChange = (event) => {
    if (event.target.files[0]) {
      setNewProfilePic(event.target.files[0]);
    }
  };
  const handleEditName = () => {
    setIsEditingName(true); // Show the pop-up
  };

  const handleEditProliePic = () => {
    setIsEditingPic(true); // Show the profile pic pop-up
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
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(
          userDocRef,
          { displayName: newName, photoURL: imageUrl },
          { merge: true },
        );

        setIsEditingPic(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleUpdateName = async () => {
    if (newName && currentUser !== null) {
      try {
        if (newName.length > 20) {
          setErrorMessage('Display Name cannot exceed 20 characters');
          throw new Error('Display Name cannot exceed 20 characters');
        }
        setErrorMessage('');
        await updateProfile(currentUser, {
          displayName: newName, // Set the new displayName here
        });
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, { displayName: newName }, { merge: true });
        setIsEditingName(false); // Hide the pop-up after updating
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return (
    <div className="main">
      <Navbar />
      <h1 className="welcome-header">
        Welcome, {currentUser ? currentUser.displayName : 'User'}!
      </h1>
      <div className="column-container">
        <div className="column">
          {/* Display profile picture */}
          <div className="profile-pic-container">
            <Image
              src={currentUser?.photoURL || '/assets/display_name_icon.svg'}
              alt="Profile"
              width={150}
              height={150}
              style={{ borderRadius: '50%' }}
              placeholder="blur"
              blurDataURL="/assets/display_name_icon.svg"
            />
          </div>
          <button onClick={handleEditProliePic} className="upload-image-btn">
            <Image
              src="/assets/upload_icon.svg"
              alt="Upload Icon"
              width={20}
              height={22.5}
              className="upload-icon"
            />
            Upload Image
          </button>
          <div className="user-info-container">
            {currentUser ? (
              <h4>Email: {currentUser.email || 'N/A'}</h4>
            ) : (
              <h4>N/A</h4>
            )}
            {currentUser ? (
              <h4>Display Name: {currentUser.displayName || 'N/A'}</h4>
            ) : (
              <h4>N/A</h4>
            )}
          </div>

          <button onClick={handleEditName} className="edit-name-btn">
            <Image
              src="/assets/edit_icon.svg"
              alt="Edit Icon"
              width={20}
              height={22.5}
              className="edit-icon"
            />
            Edit Name
          </button>

          {/* Pop-up for editing profile name */}
          {isEditingName && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Edit Profile Name</h3>
                <input
                  id="profileNameInput"
                  type="text"
                  value={newName}
                  onChange={handleNameChange}
                  placeholder="New name"
                />
                <button onClick={handleUpdateName}>Save</button>
                <button onClick={handleClearNane}>Clear</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
              </div>
            </div>
          )}
          {isEditingPic && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Edit Profile Pic</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
                <button onClick={handleUpdateProfile}>Save</button>
                <button onClick={() => setIsEditingPic(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        <div className="column">
          <h1 className="lifetime-stats-header">Lifetime Stats</h1>
          <h4>Number of Receipts Scanned: {receiptCount}</h4>
          <div className="summary-pie-container">
            <SummaryPie data={mockPieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
