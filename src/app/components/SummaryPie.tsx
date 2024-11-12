import '../styles/Summary.css';

import { PieChart } from '@mui/x-charts/PieChart';

const SummaryPie = ({ data }) => {
  return (
    <PieChart
      series={[
        {
          data: data,
          arcLabel: (item) => `${item.value}%`,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={350}
      width={350}
    />
  );
};

export default SummaryPie;
