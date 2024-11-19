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
  signInWithEmailAndPassword,
} from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './profile.css';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { updatePassword } from '@firebase/auth';
import Summary from '../components/Summary';
import SummaryData from './food_summary.json';

export default function Profile() {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const [receiptCount, setReceiptCount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          const yearlyOverviewRef = collection(db, 'yearlyOverview');
          const q = query(
            yearlyOverviewRef,
            where('userID', '==', currentUser.uid),
          );
          const querySnapshot = await getDocs(q);
          setReceiptCount(querySnapshot.size);

          let totalSpent = 0;
          let totalReceipts = 0;

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.yearlyOverviewData) {
              const yearlyData = data.yearlyOverviewData;
              Object.keys(yearlyData).forEach((year) => {
                const yearData = yearlyData[year];
                if (yearData.totalSpent) {
                  totalSpent += parseFloat(yearData.totalSpent);
                }
                if (yearData.totalReceipts) {
                  totalReceipts += parseInt(yearData.totalReceipts, 10);
                }
              });
            }
          });

          setTotalAmount(parseFloat(totalSpent.toFixed(2)));
          setReceiptCount(totalReceipts);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [currentUser, router]);

  const [isEditingName, setIsEditingName] = useState(false); // Control the pop-up state
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newName, setNewName] = useState(''); // State for the new name
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null); // State for profile picture
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleClearNane = () => {
    setNewName('');
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      setNewProfilePic(event.target.files[0]);
    }
  };

  const handleCurrentPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleEditResetPassword = () => {
    setIsResettingPassword(true);
  };

  const handleEditProliePic = () => {
    setIsEditingPic(true);
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
          setNameErrorMessage('Display Name cannot exceed 20 characters');
          throw new Error('Display Name cannot exceed 20 characters');
        }
        setNameErrorMessage('');
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

  const handleResetPassword = async () => {
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setCurrentPassword('');
      setConfirmPassword('');
      setNewPassword('');
      setSuccessMessage('');
      setPasswordErrorMessage('');
      // Reauthenticate the user with their current password
      if (currentUser && currentUser.email) {
        await signInWithEmailAndPassword(
          auth,
          currentUser.email,
          currentPassword,
        );

        // If authentication is successful, update the password
        await updatePassword(currentUser, newPassword);

        setSuccessMessage('Your password has been updated successfully.');
        setTimeout(() => {
          setSuccessMessage('');
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setPasswordErrorMessage('Failed to reset password. Please try again.');
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
          <h1 className="user-settings-header">User Settings</h1>
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
              className="edit-icon-1"
            />
            Edit Name
          </button>

          <button
            onClick={handleEditResetPassword}
            className="reset-password-btn"
          >
            <Image
              src="/assets/edit_icon.svg"
              alt="Edit Icon"
              width={20}
              height={22.5}
              className="edit-icon-2"
            />
            Reset Password
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
                <div className="button-container">
                  <button onClick={handleUpdateName}>Save</button>
                  <button onClick={handleClearNane}>Clear</button>
                  <button onClick={() => setIsEditingName(false)}>
                    Cancel
                  </button>
                </div>
                {nameErrorMessage && (
                  <p className="error-message">{nameErrorMessage}</p>
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
                <div className="button-container">
                  <button onClick={handleUpdateProfile}>Save</button>
                  <button onClick={() => setIsEditingPic(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          {isResettingPassword && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Reset Password</h2>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <div className="button-container">
                  <button onClick={handleResetPassword}>Save</button>
                  <button onClick={() => setIsResettingPassword(false)}>
                    Cancel
                  </button>
                </div>
                {passwordErrorMessage && (
                  <p className="error-message">{passwordErrorMessage}</p>
                )}
                {successMessage && (
                  <p className="success-message">{successMessage}</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="column">
          <h1 className="lifetime-stats-header">Lifetime Stats</h1>
          <h4>Number of Receipts Scanned: {receiptCount}</h4>
          <div className="summary-pie-container">
            <Summary data={SummaryData.foodGroups} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  );
}
