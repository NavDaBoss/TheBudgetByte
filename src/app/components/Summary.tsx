import { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import '../styles/Summary.css';

const Summary = ({ data, totalCost }) => {
  const colorMap = {
    Fruits: '#ed1c24',
    Grains: '#fcd112',
    Vegetables: '#15be53',
    Dairy: '#42cafd',
    Protein: '#9d44b5',
    Uncategorized: '#000000',
  };

  const pieData = useMemo(
    () =>
      data
        .map((item) => ({
          label: item.type,
          quantity: item.quantity,
          totalCost: item.totalCost,
          value: item.pricePercentage,
          color: colorMap[item.type],
        }))
        .sort((a, b) => b.value - a.value),
    [data],
  );

  const donutChartData = {
    labels: pieData.map((item) => item.label),
    datasets: [
      {
        data: pieData.map((item) => item.value),
        backgroundColor: pieData.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  };

  const donutChartOptions = {
    cutout: '80%',
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const item = pieData[index];
            return `$${item.totalCost.toFixed(2)}`;
          },
        },
      },
    },
  };

  const barChartData = {
    labels: pieData.map((item) => item.label),
    datasets: [
      {
        label: 'Price per Group',
        data: pieData.map((item) => item.totalCost),
        backgroundColor: pieData.map((item) => item.color),
      },
    ],
  };

  const barChartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const item = pieData[index];
            return `$${item.totalCost.toFixed(2)}`;
          },
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: false,
          text: 'Food Groups',
        },
      },
      y: {
        ticks: {
          callback: (value) => `$${value}`,
        },
        title: {
          display: false,
          text: 'Price per Group ($)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="summary-card">
      <h1>Summary</h1>
      <div className="summary-card-content">
        <div className="chart-legend-container">
          <div className="doughnut-chart">
            <Doughnut data={donutChartData} options={donutChartOptions} />
            <div className="doughnut-center">
              <p>Total Cost</p>
              <h2>${totalCost}</h2>
            </div>
          </div>
          <div className="food-group-legend">
            {pieData.map((item) => (
              <div key={item.label} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="legend-label">{item.label}</span>
                <span className="legend-percentage">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bar-chart-container">
          <h2>Spendings</h2>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
