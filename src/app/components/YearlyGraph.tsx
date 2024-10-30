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
    setCategoryLegend: (value: CategoryLegend) => void;
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
    selectedYear, params
}) => {

    // Get the assigned colored for this category
    const getBorderColor = (category: string) => {
        const dataset = params.graphData.datasets.find(
            (d) => d.label.toLowerCase() === category,
        );
        return dataset ? dataset.borderColor : 'rgba(0, 0, 0, 1)';
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
        params.setCategoryLegend((prevState) => ({
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

                {/* For every category within the custom legend */}
                <div className="legend-container">
                    {Object.keys(params.categoryLegend).map((category) => {
                        return (
                            <FormControlLabel
                                key={category}
                                control={
                                    <Checkbox
                                        checked={params.categoryLegend[category]}
                                        onChange={() => handleCheckboxChange(category)}
                                        style={{ color: getBorderColor(category) }} // Use the logged border color here
                                    />
                                }
                                label={category.charAt(0).toUpperCase() + category.slice(1)}
                            />
                        );
                    })}
                </div>
                <Line data={params.graphData} options={options} />
            </CardContent>
        </Card>
    );
};
