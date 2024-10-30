'use client';

import React, { useEffect, useState } from 'react';
import './analytics.css';
import Navbar from '../components/Navbar';
import { Line } from 'react-chartjs-2';
import { ApiResponse, FoodGroupInfo, userData, FoodGroups } from './user';
import {
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

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

interface AnalyticsLineGraphProps {
  selectedYear: string;
}

type Category = keyof CategoryLegend;

interface CategoryLegend {
  [category: string]: boolean;
}

const AnalyticsLineGraph: React.FC<AnalyticsLineGraphProps> = ({
  selectedYear,
}) => {
  // get the data for all populated months of the selected year
  const monthlyData = userData.yearlyOverview[selectedYear];
  if (!monthlyData) {
    return <div>No data available for {selectedYear}</div>;
  }

  const [categoryLegend, setCategoryLegend] = useState<CategoryLegend>({
    fruits: true,
    veggies: true,
    protein: true,
    grain: true,
    dairy: true,
    total: true,
  });

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

  const getBorderColor = (category: string) => {
    const dataset = graphData.datasets.find(
      (d) => d.label.toLowerCase() === category,
    );
    return dataset ? dataset.borderColor : 'rgba(0, 0, 0, 1)'; // Replace 'defaultColor' with a fallback color if necessary
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount Spent ($)',
        },
      },
    },
  };

  const handleCheckboxChange = (category: string) => {
    setCategoryLegend((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Monthly Spending Overview ({selectedYear})
        </Typography>

        {/* Custom Legend with Checkboxes */}
        <div className="legend-container">
          {Object.keys(categoryLegend).map((category) => {
            return (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={categoryLegend[category]}
                    onChange={() => handleCheckboxChange(category)}
                    style={{ color: getBorderColor(category) }} // Use the logged border color here
                  />
                }
                label={category.charAt(0).toUpperCase() + category.slice(1)}
              />
            );
          })}
        </div>

        <Line data={graphData} options={options} />
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const years = ['2024', '2023'];

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
      <div>
        <AnalyticsLineGraph selectedYear={selectedYear} />
      </div>
    </div>
  );
};

export default Analytics;
