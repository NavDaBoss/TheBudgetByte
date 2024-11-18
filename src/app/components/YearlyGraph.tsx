'use client';

import React, { useEffect, useState } from 'react';
import '../styles/YearlyGraph.css';
import { Line } from 'react-chartjs-2';
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

interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  hidden: boolean;
  fill?: boolean;
}

interface GraphData {
  labels: string[];
  datasets: Dataset[];
}

export interface GraphParams {
  categoryLegend: CategoryLegend;
  setCategoryLegend: React.Dispatch<React.SetStateAction<CategoryLegend>>;
  graphData: GraphData;
}

export type Category = keyof CategoryLegend;

export interface CategoryLegend {
  [category: string]: boolean;
}

interface AnalyticsLineGraphProps {
  selectedYear: string;
  params: GraphParams;
}

export const AnalyticsLineGraph: React.FC<AnalyticsLineGraphProps> = ({
  selectedYear,
  params,
}) => {
  // Get the assigned colored for this category
  const getBorderColor = (category: Category) => {
    const dataset = params.graphData.datasets.find((d) => d.label === category);
    return dataset ? dataset.borderColor : 'rgba(0, 0, 0, 1)';
  };

  const options = {
    responsive: true,
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

  const handleCheckboxChange = (category: Category) => {
    params.setCategoryLegend((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" className="responsive-heading">
          Monthly Spending Overview ({selectedYear})
        </Typography>

        {/* Render custom checkable legend */}
        <div className="legend-container">
          {Object.keys(params.categoryLegend).map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={params.categoryLegend[category]}
                  onChange={() => handleCheckboxChange(category as Category)}
                  style={{ color: getBorderColor(category as Category) }}
                />
              }
              label={category}
            />
          ))}
        </div>
        <Line data={params.graphData} options={options} />
      </CardContent>
    </Card>
  );
};
