'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './profile.css';
import { FoodGroupSummary } from '../profile/summaryInterfaces';
import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import { auth } from '../firebase/firebaseConfig';
import {
  fetchYearlyOverviewData,
  updateDisplayName,
  updateProfilePicture,
  resetUserPassword,
} from '../backend/fetchProfileData';

export default function Profile() {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const [receiptCount, setReceiptCount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [foodGroupSummary, setFoodGroupSummary] = useState<FoodGroupSummary>({
    foodGroups: [],
    summary: {
      totalCount: 0,
      totalCost: 0.0,
    },
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      fetchYearlyOverviewData(
        setFoodGroupSummary,
        setTotalAmount,
        setReceiptCount,
      );
    }
  }, [currentUser, router]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newName, setNewName] = useState('');
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClearNane = () => {
    setNewName('');
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
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

  const handleEditNamePopup = () => {
    setIsEditingName(true);
  };

  const handleEditResetPasswordPopup = () => {
    setIsResettingPassword(true);
  };

  const handleEditProliePicPopup = () => {
    setIsEditingPic(true);
  };

  const handleUpdateProfile = async () => {
    await updateProfilePicture(newProfilePic, newName, setIsEditingPic);
  };

  const handleUpdateName = async () => {
    await updateDisplayName(newName, setIsEditingName, setNameErrorMessage);
  };

  const handleResetPassword = async () => {
    await resetUserPassword(
      currentPassword,
      newPassword,
      confirmPassword,
      setPasswordErrorMessage,
      setSuccessMessage,
      router,
    );
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
          <button
            onClick={handleEditProliePicPopup}
            className="upload-image-btn"
          >
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

          <button onClick={handleEditNamePopup} className="edit-name-btn">
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
            onClick={handleEditResetPasswordPopup}
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
            <Summary
              data={foodGroupSummary.foodGroups}
              totalCost={totalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
