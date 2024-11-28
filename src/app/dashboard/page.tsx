'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseConfig';
import useGroceries from '../hooks/useGroceries';
import {
  updateGroceryField,
  updateReceiptBalance,
} from '../firebase/firebaseService';

import './dashboard.css';

import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import Receipt from '../components/Receipt';

const Dashboard = () => {
  const router = useRouter();
  const currentUser = auth.currentUser;

  const {
    groceries,
    receiptID,
    receiptBalance,
    receiptDate,
    loading,
    error,
    updateGroceryItem,
    refetch,
  } = useGroceries(currentUser?.uid || null);

  const [summaryData, setSummaryData] = useState({
    foodGroups: [],
    totalCost: 0,
  });

  const handleUpdate = async (groceryID, fieldName, value) => {
    try {
      await updateGroceryField(receiptID, groceryID, fieldName, value);
      await updateGroceryItem(groceryID, fieldName, value);

      if (fieldName === 'itemPrice') {
        recalculateSummary();
      }
    } catch (error) {
      console.log('Error updating grocery:', error);
    }
  };

  const recalculateSummary = async () => {
    if (!receiptID) {
      console.error('ReceiptID is not available. Skipping recalculation.');
      return;
    }

    const updatedFoodGroups = {};
    let totalCost = 0.0;

    groceries.forEach((item) => {
      const foodGroup = item.foodGroup;
      const price = parseFloat(item.itemPrice || 0) * (item.quantity || 0);

      if (!updatedFoodGroups[foodGroup]) {
        updatedFoodGroups[foodGroup] = 0;
      }

      updatedFoodGroups[foodGroup] += price;
      totalCost += price;
    });

    totalCost = Math.round(totalCost * 100) / 100;

    const foodGroups = Object.entries(updatedFoodGroups).map(
      ([type, groupCost]) => {
        const roundedGroupCost = Math.round(groupCost * 100) / 100;
        const percentage = totalCost > 0 ? (groupCost / totalCost) * 100 : 0;
        return {
          type,
          totalCost: roundedGroupCost,
          pricePercentage: Math.round(percentage * 100) / 100,
        };
      },
    );

    setSummaryData({ foodGroups, totalCost });

    try {
      if (totalCost !== receiptBalance) {
        await updateReceiptBalance(receiptID, totalCost);
      }
    } catch (error) {
      console.error('Failed to update receipt balance in DB:', error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }),
    [currentUser, router];

  useEffect(() => {
    recalculateSummary();
  }, [groceries]);
  return (
    <div className="page">
      <Navbar />
      <div className="dashboard-section-container">
        <div className="dashboard-content">
          <div className="left-section">
            <Summary
              data={summaryData.foodGroups}
              summaryDate={receiptDate}
              totalCost={summaryData.totalCost}
            />
          </div>
          <div className="right-section">
            <div className="receipt-card">
              {loading ? (
                <div className="receipt-component-head">
                  <h1>Receipt</h1>
                  <p>Loading Receipt...</p>
                </div>
              ) : (
                <Receipt
                  groceries={groceries}
                  onUpload={refetch}
                  onUpdate={handleUpdate}
                  receiptDate={receiptDate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Dashboard;
