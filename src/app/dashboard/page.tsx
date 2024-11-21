'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseConfig';
import useGroceries from '../hooks/useGroceries';
import { updateGroceryField } from '../firebase/firebaseService';

import './dashboard.css';

import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import Receipt from '../components/Receipt';
import OcrUploadButton from '../components/OcrUploadButton';

import SummaryData from './food_summary.json';

const Dashboard = () => {
  const router = useRouter();
  const currentUser = auth.currentUser;

  const { groceries, receiptID, loading, error, updateGroceryItem } =
    useGroceries(currentUser?.uid || null);

  const handleUpdate = async (groceryID, fieldName, value) => {
    try {
      await updateGroceryField(receiptID, groceryID, fieldName, value);
      await updateGroceryItem(groceryID, fieldName, value);
    } catch (error) {
      console.log('Error updating grocery:', error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }),
    [currentUser, router];

  return (
    <div>
      <Navbar />
      <div className="dashboard-section-container">
        <Summary
          data={SummaryData.foodGroups}
          totalAmount={SummaryData.summary.totalCost}
        />
        <OcrUploadButton />
        <div className="receipt-card">
          {loading ? (
            <p>Loading Receipt...</p>
          ) : (
            <Receipt groceries={groceries} onUpdate={handleUpdate} />
          )}
        </div>
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Dashboard;
