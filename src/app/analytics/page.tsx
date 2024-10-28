'use client';

import React, { useEffect, useState } from 'react';
import "./analytics.css";
import Navbar from "../components/Navbar/Navbar";
import userData from './user.json';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
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
  CategoryScale,   // This registers the 'category' scale
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DropDown = ({ selectedValue, setSelectedValue, values, drop_label }) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  const handleYearChange = (year) => {
    setSelectedValue(year);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(prev => !prev); // Toggle dropdown visibility
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
                onClick={() => handleYearChange(value)}
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

const AnalyticsLineGraph = ({selectedYear}) => {
  const monthlyData = userData.user.yearlyOverview[selectedYear];
  if (!monthlyData) {
    return <div>No data available for {selectedYear}</div>;
  }
  const months = Object.keys(monthlyData);
  const spendingData = months.map(month => monthlyData[month].totalSpent);
  // return (
  // <div> {spendingData}</div>);
  // Line chart data
  const data = {
    labels: months,
    datasets: [
      {
        label: 'Total Spent ($)',
        data: spendingData,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1, // Line tension for smooth curves
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text:  `Monthly Spending in ${selectedYear}`,
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
          text: 'Total Spent ($)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Monthly Spending Overview ({selectedYear})
        </Typography>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
};



const Analytics = () => {
  const [selectedYear, setSelectedYear] = useState("2024"); // Default to 2024
  const years = ["2024", "2023"];
  return (
    <div className="page">
      <div>
        <Navbar />
      </div>
      <div className = "section-container">
        <DropDown selectedValue={selectedYear} setSelectedValue={setSelectedYear} values={years}drop_label="Selected Year:"/>
      </div>
      <div className = "section-container">
      <AnalyticsLineGraph selectedYear={selectedYear}/>
      </div>
    </div>
  );
};

export default Analytics;