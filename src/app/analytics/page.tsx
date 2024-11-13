'use client';

import React, { useEffect, useState } from 'react';
import './analytics.css';
import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import {
  AnalyticsLineGraph,
  CategoryLegend,
  GraphParams,
} from '../components/YearlyGraph';
import {
  FoodTypes,
  FoodGroupInfo,
  MonthlyData,
  YearlyOverview,
  YearlyOverviewData,
} from './yearlyOverviewInterface';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import DropDown from '../components/DropdownButton';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Displays the months before and after
const getMonthsToDisplay = (monthlyData: { [month: string]: MonthlyData }) => {
  // Sort the keys of monthlyData according to the `months` array order
  const sortedMonths = Object.keys(monthlyData).sort(
    (a, b) => months.indexOf(a) - months.indexOf(b),
  );

  // Find the first and last months with data in sortedMonths
  const firstMonth = sortedMonths[0];
  const lastMonth = sortedMonths[sortedMonths.length - 1];

  // Get the indices of these months in the full `months` array.
  let start = months.indexOf(firstMonth);
  let end = months.indexOf(lastMonth);

  // Display the month before and after the months with data.
  if (start > 0) {
    start -= 1;
  }
  if (end < months.length - 1) {
    end += 1;
  }
  // Use end + 1 to include last month in the slide.
  return months.slice(start, end + 1);
};

const createYearlyMoneySpentGraphParams = (
  selectedYear: string,
  yearlyOverview: YearlyOverview,
  categoryLegend: CategoryLegend,
  setCategoryLegend: React.Dispatch<React.SetStateAction<CategoryLegend>>,
) => {
  // get the data for all populated months of the selected year
  const monthlyData = yearlyOverview.yearlyOverviewData[selectedYear];
  if (!monthlyData) {
    throw new Error(`No data available for ${selectedYear}`);
  }

  const displayedMonths = getMonthsToDisplay(monthlyData);
  // Get the total cost spent on a category
  const getCategoryData = (category: FoodTypes) => {
    return displayedMonths.map((month) => {
      if (month in monthlyData) {
        const foodGroup = monthlyData[month].foodGroups.find(
          (group: FoodGroupInfo) => group.type === category,
        );
        return foodGroup ? foodGroup.totalCost : 0;
      } else {
        return 0;
      }
    });
  };

  // Calculate total spending for the visible categories
  const calculateTotalData = () => {
    return displayedMonths.map((month) => {
      let sum = 0;
      for (const category in categoryLegend) {
        if (
          categoryLegend[category] &&
          category !== 'Total' &&
          month in monthlyData
        ) {
          // Check if category is checkmarked
          const foodGroup = monthlyData[month].foodGroups.find(
            (group: FoodGroupInfo) => group.type === category,
          );
          sum += foodGroup ? foodGroup.totalCost : 0;
        }
      }
      return sum;
    });
  };

  const graphData = {
    labels: displayedMonths,
    datasets: [
      {
        label: 'Total',
        data: calculateTotalData(),
        borderColor: 'rgba(112,128,144, 1)',
        hidden: !categoryLegend.Total,
      },
      {
        label: FoodTypes.Fruits,
        data: getCategoryData(FoodTypes.Fruits),
        borderColor: 'rgba(255,182,193, 1)',
        hidden: !categoryLegend.Fruits,
      },
      {
        label: FoodTypes.Vegetables,
        data: getCategoryData(FoodTypes.Vegetables),
        borderColor: 'rgba(143,188,143, 1)',
        hidden: !categoryLegend.Vegetables,
      },
      {
        label: FoodTypes.Protein,
        data: getCategoryData(FoodTypes.Protein),
        borderColor: 'rgba(147,112,219, 1)',
        hidden: !categoryLegend.Protein,
      },
      {
        label: FoodTypes.Grains,
        data: getCategoryData(FoodTypes.Grains),
        borderColor: 'rgba(255,140,0, 1)',
        hidden: !categoryLegend.Grains,
      },
      {
        label: FoodTypes.Dairy,
        data: getCategoryData(FoodTypes.Dairy),
        fill: false,
        borderColor: 'rgba(135,206,250, 1)',
        hidden: !categoryLegend.Dairy,
      },
    ],
  };
  const graphParams: GraphParams = {
    categoryLegend,
    setCategoryLegend,
    graphData,
  };

  return graphParams;
};

const Analytics = () => {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const [yearlyOverview, setOverview] = useState<YearlyOverview | null>(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [categoryLegend, setCategoryLegend] = useState<CategoryLegend>({
    Total: true,
    Fruits: true,
    Vegetables: true,
    Protein: true,
    Grains: true,
    Dairy: true,
  });

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
          console.error('Error fetching receipt count:', error);
        }
      };
      fetchYearlyOverview();
    }
  }, [currentUser, router]);

  // Set initial selectedYear and selectedMonth when yearlyOverview is ready
  useEffect(() => {
    if (yearlyOverview) {
      const years = Object.keys(yearlyOverview.yearlyOverviewData);
      const initialYear = years[0];
      const months = Object.keys(
        yearlyOverview.yearlyOverviewData[initialYear],
      );
      const initialMonth = months[0];

      setSelectedYear(initialYear);
      setSelectedMonth(initialMonth);
    }
  }, [yearlyOverview]);
  const graphParams = yearlyOverview
    ? createYearlyMoneySpentGraphParams(
        selectedYear,
        yearlyOverview,
        categoryLegend,
        setCategoryLegend,
      )
    : null;
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
            <div className="graph-container">
              {graphParams ? (
                <AnalyticsLineGraph
                  selectedYear={selectedYear}
                  params={graphParams}
                />
              ) : (
                <p>No receipts scanned in {selectedYear}</p>
              )}
            </div>
          </div>
        </div>
        <div className="month-container">
          <div className="section-container">
            <DropDown
              selectedValue={selectedMonth}
              setSelectedValue={setSelectedMonth}
              values={months}
              drop_label="Selected Month:"
            />
            <div className="summary-container">
              {yearlyOverview &&
              yearlyOverview.yearlyOverviewData[selectedYear]?.[
                selectedMonth
              ] ? (
                <Summary
                  data={
                    yearlyOverview.yearlyOverviewData[selectedYear][
                      selectedMonth
                    ].foodGroups
                  }
                  totalAmount={
                    yearlyOverview.yearlyOverviewData[selectedYear][
                      selectedMonth
                    ].totalSpent
                  }
                />
              ) : (
                <p>
                  No receipts scanned in {selectedMonth} {selectedYear}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
