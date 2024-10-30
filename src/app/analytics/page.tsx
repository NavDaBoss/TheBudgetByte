'use client';

import React, { useEffect, useState } from 'react';
import './analytics.css';
import Navbar from '../components/Navbar';
import {
  AnalyticsLineGraph,
  CategoryLegend,
  GraphParams,
  Category,
} from '../components/YearlyGraph';
import { ApiResponse, FoodGroupInfo, userData, FoodGroups } from './user';
import { CategoryRounded } from '@mui/icons-material';

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
    fruits: true,
    veggies: true,
    protein: true,
    grain: true,
    dairy: true,
    total: true,
  });

  // get the data for all populated months of the selected year
  const monthlyData = userData.yearlyOverview[selectedYear];
  if (!monthlyData) {
    throw new Error(`No data available for ${selectedYear}`);
  }

  // get the months that have data
  const months = Object.keys(monthlyData);

  // Get the total cost spent on a category
  const getCategoryData = (category: Category) => {
    return months.map((month) => {
      const foodGroup = monthlyData[month].foodGroups.find(
        (group: FoodGroups) => group[category],
      );
      return foodGroup ? foodGroup[category].totalCost : 0;
    });
  };

  // Calculate total spending for the visible categories
  const calculateTotalData = () => {
    return months.map((month) => {
      let sum = 0;
      for (const category in categoryLegend) {
        if (categoryLegend[category] && category !== 'total') {
          // Check if category is checkmarked
          const foodGroup = monthlyData[month].foodGroups.find(
            (group: FoodGroups) => group[category],
          );
          sum += foodGroup ? foodGroup[category].totalCost : 0;
        }
      }
      return sum;
    });
  };
  const graphData = {
    labels: months,
    datasets: [
      {
        label: 'Fruits',
        data: getCategoryData('fruits'),
        borderColor: 'rgba(255, 99, 132, 1)',
        hidden: !categoryLegend.fruits,
      },
      {
        label: 'Veggies',
        data: getCategoryData('veggies'),
        borderColor: 'rgba(54, 162, 235, 1)',
        hidden: !categoryLegend.veggies,
      },
      {
        label: 'Protein',
        data: getCategoryData('protein'),
        borderColor: 'rgba(75, 192, 192, 1)',
        hidden: !categoryLegend.protein,
      },
      {
        label: 'Grain',
        data: getCategoryData('grain'),
        borderColor: 'rgba(255, 206, 86, 1)',
        hidden: !categoryLegend.grain,
      },
      {
        label: 'Dairy',
        data: getCategoryData('dairy'),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        hidden: !categoryLegend.dairy,
      },
      {
        label: 'Total',
        data: calculateTotalData(),
        borderColor: 'rgba(0, 0, 0, 1)',
        hidden: !categoryLegend.total,
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
  const years = ['2024', '2023'];
  const [selectedMonth, setSelectedMonth] = useState('January');
  const monthsInSelectedYear = ['January', 'February'];
  const graphParams = createYearlyMoneySpentGraphParams(selectedYear);
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
    </div>
  );
};

export default Analytics;
