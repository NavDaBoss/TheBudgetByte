import React, { useState } from 'react';
import './analytics.css';
import {
  AnalyticsLineGraph,
  CategoryLegend,
  GraphParams,
} from '../components/YearlyGraph';
import {
  monthNames,
  FoodTypes,
  FoodGroupInfo,
  MonthlyData,
  YearlyOverview,
} from '../backend/yearlyOverviewInterface';

// Displays the months before and after
const getMonthsToDisplay = (monthlyData: { [month: string]: MonthlyData }) => {
  // Sort the keys of monthlyData according to the `months` array order
  const sortedMonths = Object.keys(monthlyData).sort(
    (a, b) => monthNames.indexOf(a) - monthNames.indexOf(b),
  );

  // Find the first and last months with data in sortedMonths
  const firstMonth = sortedMonths[0];
  const lastMonth = sortedMonths[sortedMonths.length - 1];

  // Get the indices of these months in the full `months` array.
  let start = monthNames.indexOf(firstMonth);
  let end = monthNames.indexOf(lastMonth);

  // Display the month before and after the months with data.
  if (start > 0) {
    start -= 1;
  }
  if (end < monthNames.length - 1) {
    end += 1;
  }
  // Use end + 1 to include last month in the slide.
  return monthNames.slice(start, end + 1);
};

const createYearlyMoneySpentGraphParams = (
  selectedYear: string,
  yearlyOverview: YearlyOverview,
  categoryLegend: CategoryLegend,
  setCategoryLegend: React.Dispatch<React.SetStateAction<CategoryLegend>>,
) => {
  // get the data for all populated months of the selected year
  if (!yearlyOverview.yearlyOverviewData[selectedYear]) {
    console.log(`No data available for ${selectedYear}`);
    return null;
  }
  const monthlyData =
    yearlyOverview.yearlyOverviewData[selectedYear].monthlyData;
  if (!monthlyData) {
    console.log(`No data available for ${selectedYear}`);
    return null;
  }

  const displayedMonths = getMonthsToDisplay(monthlyData);
  // Get the total cost spent on a category
  const getCategoryData = (category: FoodTypes) => {
    return displayedMonths.map((month) => {
      if (month in monthlyData) {
        const foodGroup = monthlyData[month].foodGroups.find(
          (group: FoodGroupInfo) => group.type === category,
        );
        return foodGroup ? foodGroup.totalCost : 0;
      } else {
        return 0;
      }
    });
  };

  // Calculate total spending for the visible categories
  const calculateTotalData = () => {
    return displayedMonths.map((month) => {
      let sum = 0;
      for (const category in categoryLegend) {
        if (
          categoryLegend[category] &&
          category !== 'Total' &&
          month in monthlyData
        ) {
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
    labels: displayedMonths,
    datasets: [
      {
        label: 'Total',
        data: calculateTotalData(),
        borderColor: 'rgba(112,128,144, 1)',
        hidden: !categoryLegend.Total,
      },
      {
        label: FoodTypes.Fruits,
        data: getCategoryData(FoodTypes.Fruits),
        borderColor: 'rgba(255,182,193, 1)',
        hidden: !categoryLegend.Fruits,
      },
      {
        label: FoodTypes.Vegetables,
        data: getCategoryData(FoodTypes.Vegetables),
        borderColor: 'rgba(143,188,143, 1)',
        hidden: !categoryLegend.Vegetables,
      },
      {
        label: FoodTypes.Protein,
        data: getCategoryData(FoodTypes.Protein),
        borderColor: 'rgba(147,112,219, 1)',
        hidden: !categoryLegend.Protein,
      },
      {
        label: FoodTypes.Grains,
        data: getCategoryData(FoodTypes.Grains),
        borderColor: 'rgba(255,140,0, 1)',
        hidden: !categoryLegend.Grains,
      },
      {
        label: FoodTypes.Dairy,
        data: getCategoryData(FoodTypes.Dairy),
        fill: false,
        borderColor: 'rgba(135,206,250, 1)',
        hidden: !categoryLegend.Dairy,
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
interface SpendingInYearGraphProps {
  selectedYear: string;
  yearlyOverview: YearlyOverview | null;
}

const SpendingInYearGraph: React.FC<SpendingInYearGraphProps> = ({
  selectedYear,
  yearlyOverview,
}) => {
  const [categoryLegend, setCategoryLegend] = useState<CategoryLegend>({
    Total: true,
    Fruits: true,
    Vegetables: true,
    Protein: true,
    Grains: true,
    Dairy: true,
  });
  const graphParams = yearlyOverview
    ? createYearlyMoneySpentGraphParams(
        selectedYear,
        yearlyOverview,
        categoryLegend,
        setCategoryLegend,
      )
    : null;
  return (
    <div className="graph-container">
      {graphParams ? (
        <AnalyticsLineGraph selectedYear={selectedYear} params={graphParams} />
      ) : (
        <p>No receipts scanned in {selectedYear}</p>
      )}
    </div>
  );
};

export default SpendingInYearGraph;
