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
import { userData, FoodTypes, FoodGroupInfo } from './user';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseConfig';

interface DropDownProps {
  selectedValue: string; // Current selected value
  setSelectedValue: (value: string) => void; // Function to update the selected value
  values: string[]; // Array of values to display in the dropdown
  drop_label: string; // Label for the dropdown
}

const DropDown: React.FC<DropDownProps> = ({
  selectedValue,
  setSelectedValue,
  values,
  drop_label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (val: string) => {
    setSelectedValue(val);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="button-container">
      <label style={{ marginRight: '8px' }}>{drop_label}</label>
      <div className="dropdown-container">
        <div className="dropdown-wrapper" onClick={toggleDropdown}>
          <div className="selected-year">{selectedValue}</div>
          <div className="dropdown-arrow"></div>
        </div>
        {isOpen && (
          <div className="custom-dropdown">
            {values.map((value) => (
              <div
                key={value}
                className="dropdown-option"
                onClick={() => handleValueChange(value)}
              >
                {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const createYearlyMoneySpentGraphParams = (selectedYear: string) => {
  const [categoryLegend, setCategoryLegend] = useState<CategoryLegend>({
    Fruits: true,
    Veggies: true,
    Protein: true,
    Grain: true,
    Dairy: true,
    Total: true,
  });

  // get the data for all populated months of the selected year
  const monthlyData = userData.yearlyOverview[selectedYear];
  if (!monthlyData) {
    throw new Error(`No data available for ${selectedYear}`);
  }

  // get the months that have data
  const months = Object.keys(monthlyData);

  // Get the total cost spent on a category
  const getCategoryData = (category: FoodTypes) => {
    return months.map((month) => {
      const foodGroup = monthlyData[month].foodGroups.find(
        (group: FoodGroupInfo) => group.type === category,
      );
      return foodGroup ? foodGroup.totalCost : 0;
    });
  };

  // Calculate total spending for the visible categories
  const calculateTotalData = () => {
    return months.map((month) => {
      let sum = 0;
      for (const category in categoryLegend) {
        if (categoryLegend[category] && category !== 'Total') {
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
    labels: months,
    datasets: [
      {
        label: FoodTypes.Fruits,
        data: getCategoryData(FoodTypes.Fruits),
        borderColor: 'rgba(255,182,193, 1)',
        hidden: !categoryLegend.Fruits,
      },
      {
        label: FoodTypes.Veggies,
        data: getCategoryData(FoodTypes.Veggies),
        borderColor: 'rgba(143,188,143, 1)',
        hidden: !categoryLegend.Veggies,
      },
      {
        label: FoodTypes.Protein,
        data: getCategoryData(FoodTypes.Protein),
        borderColor: 'rgba(147,112,219, 1)',
        hidden: !categoryLegend.Protein,
      },
      {
        label: FoodTypes.Grain,
        data: getCategoryData(FoodTypes.Grain),
        borderColor: 'rgba(255,140,0, 1)',
        hidden: !categoryLegend.Grain,
      },
      {
        label: FoodTypes.Dairy,
        data: getCategoryData(FoodTypes.Dairy),
        fill: false,
        borderColor: 'rgba(135,206,250, 1)',
        hidden: !categoryLegend.Dairy,
      },
      {
        label: 'Total',
        data: calculateTotalData(),
        borderColor: 'rgba(112,128,144, 1)',
        hidden: !categoryLegend.Total,
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
  const [selectedYear, setSelectedYear] = useState('2024');
  const years = Object.keys(userData.yearlyOverview);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const monthsInSelectedYear = Object.keys(
    userData.yearlyOverview[selectedYear],
  );
  const graphParams = createYearlyMoneySpentGraphParams(selectedYear);
  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }),
    [currentUser, router];

  return (
    <div className="page">
      <div>
        <Navbar />
      </div>
      <div className="section-container">
        <DropDown
          selectedValue={selectedYear}
          setSelectedValue={setSelectedYear}
          values={years}
          drop_label="Selected Year:"
        />
      </div>
      <div className="graph-container">
        <AnalyticsLineGraph selectedYear={selectedYear} params={graphParams} />
      </div>
      <div className="section-container">
        <DropDown
          selectedValue={selectedMonth}
          setSelectedValue={setSelectedMonth}
          values={monthsInSelectedYear}
          drop_label="Selected Month:"
        />
      </div>
      <div className="pie-container">
        <Summary
          groups={
            userData.yearlyOverview[selectedYear][selectedMonth].foodGroups
          }
        />
      </div>
    </div>
  );
};

export default Analytics;
