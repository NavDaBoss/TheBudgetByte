'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import './dashboard.css';

import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import Receipt from '../components/Receipt';
import OcrUploadButton from '../components/OcrUploadButton';

import GroceryData from './groceries.json';
import SummaryData from './food_summary.json';

const Dashboard = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [groceries, setGroceries] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }),
    [currentUser, router];

  useEffect(() => {
    const fetchMostRecentReceipt = async () => {
      if (currentUser) {
        try {
          const receiptRef = collection(db, 'receiptData');
          const q = query(
            receiptRef,
            where('userID', '==', currentUser.uid),
            orderBy('submittedTimestamp', 'desc'),
            limit(1),
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const mostRecentReceipt = querySnapshot.docs[0].data();
            console.log('Fetched receipt:', mostRecentReceipt.groceries);
            setGroceries(mostRecentReceipt.groceries || []);
          } else {
            console.log('No recent receipts found');
          }
        } catch (error) {
          console.error('Error fetching the most recent receipt:', error);
        }
      }
    };
    fetchMostRecentReceipt();
  }, [currentUser, db]);

  return (
    <div>
      <Navbar />
      <div className="section-container">
        <Summary foodGroups={SummaryData.foodGroups} />
        <div className="receipt-container">
          <Receipt groceries={groceries} />
        </div>
      </div>
      <OcrUploadButton />
    </div>
  );
};

export default Dashboard;
