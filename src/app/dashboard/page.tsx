'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseConfig';
import useGroceries from '../hooks/useGroceries';

import './dashboard.css';

import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import Receipt from '../components/Receipt';
import OcrUploadButton from '../components/OcrUploadButton';

import SummaryData from './food_summary.json';

const Dashboard = () => {
  const router = useRouter();
  const currentUser = auth.currentUser;

  const { groceries, loading, error } = useGroceries(currentUser?.uid || null);

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
        <div className="receipt-component-container">
          {loading ? <p>Loading...</p> : <Receipt groceries={groceries} />}
        </div>
      </div>
      {error && <p>Error: {error}</p>}
      <OcrUploadButton />
    </div>
  );
};

export default Dashboard;
