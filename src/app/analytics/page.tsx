'use client';

import React, { useEffect, useState } from 'react';
import './analytics.css';
import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import { YearlyOverview , monthNames} from './yearlyOverviewInterface';
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
  return (
    <div className="summary-container">
      {yearlyOverview &&
      yearlyOverview.yearlyOverviewData[selectedYear]?.[selectedMonth] ? (
        <Summary
          data={
            yearlyOverview.yearlyOverviewData[selectedYear][selectedMonth]
              .foodGroups
          }
          totalAmount={
            yearlyOverview.yearlyOverviewData[selectedYear][selectedMonth]
              .totalSpent
          }
        />
      ) : (
        <p>
          No receipts scanned in {selectedMonth} {selectedYear}
        </p>
      )}
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
      const initialYear = years[0];
      // Sort the keys of monthlyData according to the `months` array order (January -> December).
      const sortedMonths = Object.keys(
        yearlyOverview.yearlyOverviewData[initialYear],
      ).sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b));

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
      <div>
        <Navbar />
      </div>
      <div className="split-container">
        <div className="year-container">
          <div className="section-container">
            <DropDown
              selectedValue={selectedYear}
              setSelectedValue={setSelectedYear}
              values={yearValues}
              drop_label="Selected Year:"
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
              drop_label="Selected Month:"
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
