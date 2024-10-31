import '../styles/Summary.css';

import { PieChart } from '@mui/x-charts/PieChart';

const SummaryPie = ({ data }) => {
  return (
    <div className="pie-chart-container">
      <PieChart
        series={[
          {
            data: data,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={350}
        width={350}
      />
    </div>
  );
};

export default SummaryPie;
