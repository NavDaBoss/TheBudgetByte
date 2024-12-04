'use client';

import React, { useEffect, useState } from 'react';
import './analytics.css';

import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import {
  YearlyOverview,
  monthNames,
} from '../backend/yearlyOverview/yearlyOverviewInterface';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import DropDown from '../components/DropdownButton';
import SpendingInYearGraph from './spendingInYearGraph';

// Uses the summary in dashboard populated with the food data from the selected month out of the selected year.
const AnalyticsSummary = ({
  yearlyOverview,
  selectedYear,
  selectedMonth,
}: {
  yearlyOverview: YearlyOverview | null;
  selectedYear: string;
  selectedMonth: string;
}) => {
  const selectedYearData = yearlyOverview?.yearlyOverviewData[selectedYear];
  const monthlyData = selectedYearData?.monthlyData; // Safely access monthlyData

  return (
    <div className="summary-container">
      {monthlyData && monthlyData[selectedMonth] ? (
        <Summary
          data={monthlyData[selectedMonth].foodGroups} // safely access foodGroups
          totalCost={monthlyData[selectedMonth].totalSpent} // safely access totalSpent
        />
      ) : (
        <p>
          No receipts scanned in {selectedMonth} {selectedYear}
        </p>
      )}
    </div>
  );
};

const AnalyticsSummaryCard = ({
  yearlyOverview,
  selectedYear,
  selectedMonth,
}: {
  yearlyOverview: YearlyOverview | null;
  selectedYear: string;
  selectedMonth: string;
}) => {
  const selectedYearData = yearlyOverview?.yearlyOverviewData[selectedYear];
  const selectedMonthData = selectedYearData?.monthlyData[selectedMonth];

  const yearCard = {
    title: `Year: ${selectedYear}`,
    data: [
      {
        label: 'Receipts',
        value: selectedYearData?.totalReceipts || '0',
        icon: <InventoryIcon fontSize="large" />,
      },
      {
        label: 'Total Spent',
        value: selectedYearData ? `$${selectedYearData.totalSpent}` : 'No Data',
        icon: <PaidIcon fontSize="large" />,
      },
      {
        label: 'Items Bought',
        value: selectedYearData?.totalQuantity || 'No Data',
        icon: <ReceiptLongIcon fontSize="large" />,
      },
    ],
  };

  const monthCard = {
    title: `Month: ${selectedMonth}`,
    data: [
      {
        label: 'Receipts',
        value: selectedMonthData?.totalReceipts || 'No Data',
        icon: <ReceiptIcon fontSize="large" />,
      },
      {
        label: 'Spent',
        value: selectedMonthData
          ? `$${selectedMonthData.totalSpent}`
          : 'No Data',
        icon: <PaidIcon fontSize="large" />,
      },
      {
        label: 'Items Bought',
        value: selectedMonthData?.totalQuantity || 'No Data',
        icon: <ShoppingBasketIcon fontSize="large" />,
      },
    ],
  };

  return (
    <div className="analytics-card-row">
      {[yearCard, monthCard].map((card, index) => (
        <div className="analytics-card-container" key={index}>
          <h2 className="analytics-card-title">{card.title}</h2>
          <div className="analytics-stats-card-container">
            {card.data.map((item, idx) => (
              // <div className="analytics-stats-card">
              <div className="analytics-stats-card" key={item.label || idx}>
                {/* <div className="analytics-stats-content" key={idx}> */}
                <div className="analytics-stats-content">
                  <div className="analytics-stats-label">
                    <p>{item.label}</p>
                    <h3>{item.value}</h3>
                  </div>
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const [yearlyOverview, setOverview] = useState<YearlyOverview | null>(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('January');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      const fetchYearlyOverview = async () => {
        try {
          const receiptsRef = collection(db, 'yearlyOverview');
          const q = query(receiptsRef, where('userID', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          // Yearly overview exists, so retrieve and return it
          if (!querySnapshot.empty) {
            console.log('returning an existing yearlyoverview');
            const docData = querySnapshot.docs[0].data() as YearlyOverview;
            setOverview(docData);
          } else {
            setOverview(null); // Ensure state is updated to indicate no data
          }
        } catch (error) {
          console.error(
            'Error fetching yearly overview from firestore:',
            error,
          );
        }
      };
      fetchYearlyOverview();
    }
  }, [currentUser, router]);

  // Set initial selectedYear and selectedMonth when yearlyOverview is ready.
  useEffect(() => {
    if (yearlyOverview) {
      // Sort the years in descending order (most recent year first).
      const years = Object.keys(yearlyOverview.yearlyOverviewData).sort(
        (a, b) => Number(b) - Number(a),
      );
      if (!years || years.length === 0) {
        return;
      }
      const initialYear = years[0];
      // Sort the keys of monthlyData according to the `months` array order (January -> December).
      const sortedMonths = Object.keys(
        yearlyOverview.yearlyOverviewData[initialYear]?.monthlyData || {}, // Fallback to empty object if monthlyData is undefined
      ).sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b));
      if (!sortedMonths || sortedMonths.length === 0) {
        return;
      }
      setSelectedYear(initialYear);
      setSelectedMonth(sortedMonths[0]);
    }
  }, [yearlyOverview]);
  // Default to 2024 if no yearly overview data exists.
  const yearValues = yearlyOverview
    ? Object.keys(yearlyOverview.yearlyOverviewData)
    : ['2024'];

  return (
    <div className="page">
      <Navbar />
      <AnalyticsSummaryCard
        yearlyOverview={yearlyOverview}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
      <div className="split-container">
        <div className="year-container">
          <div className="section-container">
            <DropDown
              selectedValue={selectedYear}
              setSelectedValue={setSelectedYear}
              values={yearValues}
              label="Selected Year:"
            />
            <SpendingInYearGraph
              selectedYear={selectedYear}
              yearlyOverview={yearlyOverview}
            />
          </div>
        </div>
        <div className="month-container">
          <div className="section-container">
            <DropDown
              selectedValue={selectedMonth}
              setSelectedValue={setSelectedMonth}
              values={monthNames}
              label="Selected Month:"
            />
            <AnalyticsSummary
              yearlyOverview={yearlyOverview}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
