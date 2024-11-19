export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/* eslint-disable no-unused-vars */
export enum FoodTypes {
  Vegetables = 'Vegetables',
  Fruits = 'Fruits',
  Grains = 'Grains',
  Protein = 'Protein',
  Dairy = 'Dairy',
}
/* eslint-enable no-unused-vars */

// Define the type for the individual food group items
interface FoodGroupInfo {
  type: FoodTypes;
  totalCost: number;
  quantity: number;
  pricePercentage: number;
}

// Define the type for the monthly data
interface MonthlyData {
  totalReceipts: number;
  totalSpent: number;
  totalQuantity: number;
  foodGroups: FoodGroupInfo[];
}

interface YearlyOverviewData {
  totalReceipts: number;
  totalSpent: number;
  totalQuantity: number;
  monthlyData: {
    [month: string]: MonthlyData;
  };
}

interface YearlyOverview {
  yearlyOverviewData: {
    [year: string]: YearlyOverviewData;
  };
  yearlyOverviewId: string;
  userID: string;
}

export type { FoodGroupInfo, MonthlyData, YearlyOverviewData, YearlyOverview };
