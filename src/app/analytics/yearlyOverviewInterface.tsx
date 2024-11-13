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

export enum FoodTypes {
  Vegetables = 'Vegetables',
  Fruits = 'Fruits',
  Grains = 'Grains',
  Protein = 'Protein',
  Dairy = 'Dairy',
}
// Define the type for the individual food group items
interface FoodGroupInfo {
  type: FoodTypes;
  totalCost: number;
  quantity: number;
  pricePercentage: number;
}

// Define the type for the monthly data
interface MonthlyData {
  totalSpent: number;
  totalQuantity: number;
  foodGroups: FoodGroupInfo[];
}

interface YearlyOverviewData {
  [year: string]: {
    [month: string]: MonthlyData;
  };
}

interface YearlyOverview {
  yearlyOverviewData: YearlyOverviewData;
  yearlyOverviewId: string;
  userID: string;
}

export type { FoodGroupInfo, MonthlyData, YearlyOverviewData, YearlyOverview };
