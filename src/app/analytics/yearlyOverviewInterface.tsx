enum FoodTypes {
  Vegetables = 'Veggies',
  Fruits = 'Fruits',
  Grains = 'Grain',
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

export type {
  FoodTypes,
  FoodGroupInfo,
  MonthlyData,
  YearlyOverviewData,
  YearlyOverview,
};
