import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

import '../styles/Summary.css';

const Summary = ({ data, totalCost }) => {
  const colorMap = {
    Fruits: 'red',
    Vegetables: 'green',
    Protein: 'purple',
    Grains: 'orange',
    Dairy: 'blue',
  };

  const pieData = useMemo(
    () =>
      data
        .map((item) => ({
          label: item.type,
          value: item.pricePercentage,
          color: colorMap[item.type],
        }))
        .sort((a, b) => b.value - a.value),
    [data],
  );

  const chartData = {
    labels: pieData.map((item) => item.label),
    datasets: [
      {
        data: pieData.map((item) => item.value),
        backgroundColor: pieData.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="summary-card">
      <h2>Summary</h2>
      <div className="chart-legend-container">
        <div className="doughnut-chart">
          <Doughnut
            data={chartData}
            options={{
              cutout: '80%',
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
              },
            }}
          />
          <div className="doughnut-center">
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
    </div>
  );
};

export default Summary;
