'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseConfig';
import useGroceries from '../hooks/useGroceries';
import {
  addGroceryItem,
  deleteGroceryItem,
  updateGroceryField,
  updateReceiptBalance,
} from '../firebase/firebaseService';

import './dashboard.css';

import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import Receipt from '../components/Receipt';

interface FoodGroupSummary {
  type: string;
  totalCost: number;
  pricePercentage: number;
}

interface SummaryData {
  foodGroups: FoodGroupSummary[];
  totalCost: number;
}

const Dashboard = () => {
  const router = useRouter();
  const currentUser = auth.currentUser;

  // State management for groceries and receipt
  const {
    groceries,
    receiptID,
    receiptBalance,
    receiptDate,
    loading,
    error,
    updateGroceryItem,
    setGroceriesState,
    refetch,
  } = useGroceries(currentUser?.uid);

  // State for summary calculations
  const [summaryData, setSummaryData] = useState<SummaryData>({
    foodGroups: [],
    totalCost: 0,
  });

  // Updates the local groceries state
  const updateLocalGroceries = (updatedGroceries: GroceryItem[]) => {
    setGroceriesState(updatedGroceries);
  };

  // Handles adding a new grocery item
  const handleAdd = async (newItem: Omit<GroceryItem, 'id'>) => {
    try {
      if (!receiptID) return;

      // Add to Firebase and update local state
      const groceryID = await addGroceryItem(receiptID, newItem);

      const newGroceryItem: GroceryItem = { ...newItem, id: groceryID };
      const updatedGroceries = [...groceries, newGroceryItem];
      updateLocalGroceries(updatedGroceries);

      recalculateSummary(updatedGroceries);
    } catch (error) {
      console.error('Error adding grocery:', error);
    }
  };

  const handleAddClick = () => {
    if (newItem.itemName && newItem.itemPrice > 0) {
      onAdd(newItem);
      setNewItem({
        itemName: '',
        quantity: 1,
        itemPrice: 0.0,
        foodGroup: 'Uncategorized',
      });
    } else {
      alert('Please fill in all fields with valid values.');
    }
  };

  // Handles deleting a grocery item
  const handleDelete = async (groceryID: string) => {
    try {
      if (!receiptID) return;

      // Delete from Firebase and update local state
      await deleteGroceryItem(receiptID, groceryID);
      const updatedGroceries = groceries.filter(
        (item) => item.id !== groceryID,
      );
      updateLocalGroceries(updatedGroceries);

      recalculateSummary();
    } catch (error) {
      console.error('Error deleting grocery:', error);
    }
  };

  // Handles updating a field in a grocery item
  const handleUpdate = async (
    groceryID: string,
    fieldName: keyof GroceryItem,
    value: GroceryItem[keyof GroceryItem],
  ) => {
    try {
      if (!receiptID) return;

      // Update Firebase and local state
      await updateGroceryField(receiptID, groceryID, fieldName, value);
      await updateGroceryItem(groceryID, fieldName, value);

      // Recalculate the summary for price changes
      if (fieldName === 'itemPrice') {
        recalculateSummary();
      }
    } catch (error) {
      console.log('Error updating grocery:', error);
    }
  };

  // Recalculates the summary for groceries and updates Firebase if needed
  const recalculateSummary = async (
    updatedGroceries: GroceryItem[] = groceries,
  ) => {
    const updatedFoodGroups: Record<string, number> = {};
    let totalCost = 0.0;

    // Calculated total cost and group-wise costs
    updatedGroceries.forEach((item) => {
      const { foodGroup, itemPrice, quantity } = item;
      const price = parseFloat(itemPrice || 0) * (quantity || 0);

      updatedFoodGroups[foodGroup] =
        (updatedFoodGroups[foodGroup] || 0) + price;
      totalCost += price;
    });

    totalCost = Math.round(totalCost * 100) / 100;

    // Transform food group data into summary format
    const foodGroups: FoodGroupSummary[] = Object.entries(
      updatedFoodGroups,
    ).map(([type, groupCost]) => {
      const roundedGroupCost = Math.round(groupCost * 100) / 100;
      const percentage = totalCost > 0 ? (groupCost / totalCost) * 100 : 0;
      return {
        type,
        totalCost: roundedGroupCost,
        pricePercentage: Math.round(percentage * 100) / 100,
      };
    });

    setSummaryData({ foodGroups, totalCost });

    try {
      // Update receipt balance in Firebase if it has changed
      if (totalCost !== receiptBalance) {
        await updateReceiptBalance(receiptID, totalCost);
      }
    } catch (error) {
      console.error('Failed to update receipt balance in DB:', error);
    }
  };

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }),
    [currentUser, router];

  // Recalculate the summary whenever groceries change
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
                  onAdd={handleAdd}
                  onDelete={handleDelete}
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
