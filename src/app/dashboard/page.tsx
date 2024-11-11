'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseConfig';

import './dashboard.css';

import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import Receipt from '../components/Receipt';
import OcrUploadButton from '../components/OcrUploadButton';

import GroceryData from './groceries.json';
import SummaryData from './food_summary.json';

const Dashboard = () => {
  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }),
    [currentUser, router];

  return (
    <div>
      <Navbar />
      <div className="section-container">
        <Summary groups={SummaryData.foodGroups} />
        <div className="receipt-container">
          <Receipt groceries={GroceryData.groceries} />
        </div>
      </div>
      <OcrUploadButton />
    </div>
  );
};

export default Dashboard;
