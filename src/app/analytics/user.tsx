export enum FoodTypes {
  Veggies = 'Veggies',
  Fruits = 'Fruits',
  Grain = 'Grain',
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

// Define the type for the yearly overview (with dynamic years)
interface YearlyOverview {
  [year: string]: {
    [month: string]: MonthlyData;
  };
}

// Define the type for the user data
interface UserData {
  user: any;
  display_name: string;
  yearlyOverview: YearlyOverview;
}

// Define the type for the entire JSON response structure
interface ApiResponse {
  user: UserData;
}

export const userData: UserData = {
  user: undefined,
  display_name: 'jennie',
  yearlyOverview: {
    '2024': {
      January: {
        totalSpent: 450,
        totalQuantity: 15,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 80, quantity: 4, pricePercentage: 18.8 },
          { type: FoodTypes.Fruits, totalCost: 50, quantity: 3, pricePercentage: 11.1 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 5, pricePercentage: 13.3 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 3, pricePercentage: 44.4 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 2, pricePercentage: 13.3 },
        ],
      },
      February: {
        totalSpent: 400,
        totalQuantity: 14,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 70, quantity: 3, pricePercentage: 17.5 },
          { type: FoodTypes.Fruits, totalCost: 60, quantity: 4, pricePercentage: 15.0 },
          { type: FoodTypes.Grain, totalCost: 50, quantity: 4, pricePercentage: 12.5 },
          { type: FoodTypes.Protein, totalCost: 150, quantity: 2, pricePercentage: 37.5 },
          { type: FoodTypes.Dairy, totalCost: 70, quantity: 1, pricePercentage: 17.5 },
        ],
      },
      March: {
        totalSpent: 480,
        totalQuantity: 18,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 90, quantity: 4, pricePercentage: 18.8 },
          { type: FoodTypes.Fruits, totalCost: 70, quantity: 4, pricePercentage: 14.6 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 5, pricePercentage: 12.5 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 3, pricePercentage: 41.7 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 2, pricePercentage: 12.5 },
        ],
      },
      April: {
        totalSpent: 530,
        totalQuantity: 20,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 5, pricePercentage: 18.9 },
          { type: FoodTypes.Fruits, totalCost: 80, quantity: 5, pricePercentage: 15.1 },
          { type: FoodTypes.Grain, totalCost: 70, quantity: 4, pricePercentage: 13.2 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 4, pricePercentage: 37.7 },
          { type: FoodTypes.Dairy, totalCost: 80, quantity: 2, pricePercentage: 15.1 },
        ],
      },
      May: {
        totalSpent: 600,
        totalQuantity: 25,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 120, quantity: 6, pricePercentage: 20.0 },
          { type: FoodTypes.Fruits, totalCost: 90, quantity: 5, pricePercentage: 15.0 },
          { type: FoodTypes.Grain, totalCost: 70, quantity: 5, pricePercentage: 11.7 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 6, pricePercentage: 33.3 },
          { type: FoodTypes.Dairy, totalCost: 120, quantity: 3, pricePercentage: 20.0 },
        ],
      },
    },
    '2023': {
      January: {
        totalSpent: 500,
        totalQuantity: 18,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 3, pricePercentage: 20.0 },
          { type: FoodTypes.Fruits, totalCost: 50, quantity: 2, pricePercentage: 10.0 },
          { type: FoodTypes.Grain, totalCost: 50, quantity: 5, pricePercentage: 10.0 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5, pricePercentage: 50.0 },
          { type: FoodTypes.Dairy, totalCost: 100, quantity: 3, pricePercentage: 20.0 },
        ],
      },
      February: {
        totalSpent: 450,
        totalQuantity: 16,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 90, quantity: 4, pricePercentage: 20.0 },
          { type: FoodTypes.Fruits, totalCost: 60, quantity: 3, pricePercentage: 13.3 },
          { type: FoodTypes.Grain, totalCost: 40, quantity: 4, pricePercentage: 8.9 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 3, pricePercentage: 44.4 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 2, pricePercentage: 13.3 },
        ],
      },
      March: {
        totalSpent: 550,
        totalQuantity: 20,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 110, quantity: 5, pricePercentage: 20.0 },
          { type: FoodTypes.Fruits, totalCost: 70, quantity: 4, pricePercentage: 12.7 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 6, pricePercentage: 10.9 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 4, pricePercentage: 45.5 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 1, pricePercentage: 10.9 },
        ],
      },
      April: {
        totalSpent: 400,
        totalQuantity: 15,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 80, quantity: 3, pricePercentage: 20.0 },
          { type: FoodTypes.Fruits, totalCost: 40, quantity: 2, pricePercentage: 10.0 },
          { type: FoodTypes.Grain, totalCost: 50, quantity: 4, pricePercentage: 12.5 },
          { type: FoodTypes.Protein, totalCost: 150, quantity: 4, pricePercentage: 37.5 },
          { type: FoodTypes.Dairy, totalCost: 80, quantity: 2, pricePercentage: 20.0 },
        ],
      },
      May: {
        totalSpent: 600,
        totalQuantity: 22,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 120, quantity: 6, pricePercentage: 20.0 },
          { type: FoodTypes.Fruits, totalCost: 80, quantity: 5, pricePercentage: 13.3 },
          { type: FoodTypes.Grain, totalCost: 70, quantity: 5, pricePercentage: 11.7 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 4, pricePercentage: 41.7 },
          { type: FoodTypes.Dairy, totalCost: 80, quantity: 2, pricePercentage: 13.3 },
        ],
      },
      June: {
        totalSpent: 520,
        totalQuantity: 19,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 4, pricePercentage: 19.2 },
          { type: FoodTypes.Fruits, totalCost: 70, quantity: 3, pricePercentage: 13.5 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 5, pricePercentage: 11.5 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5, pricePercentage: 48.1 },
          { type: FoodTypes.Dairy, totalCost: 40, quantity: 2, pricePercentage: 7.7 },
        ],
      },
      July: {
        totalSpent: 580,
        totalQuantity: 21,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 110, quantity: 5, pricePercentage: 19.0 },
          { type: FoodTypes.Fruits, totalCost: 90, quantity: 4, pricePercentage: 15.5 },
          { type: FoodTypes.Grain, totalCost: 80, quantity: 6, pricePercentage: 13.8 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 4, pricePercentage: 43.1 },
          { type: FoodTypes.Dairy, totalCost: 50, quantity: 2, pricePercentage: 8.6 },
        ],
      },
      August: {
        totalSpent: 610,
        totalQuantity: 22,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 120, quantity: 6, pricePercentage: 19.7 },
          { type: FoodTypes.Fruits, totalCost: 100, quantity: 4, pricePercentage: 16.4 },
          { type: FoodTypes.Grain, totalCost: 80, quantity: 5, pricePercentage: 13.1 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5, pricePercentage: 41.0 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 2, pricePercentage: 9.8 },
        ],
      },
      September: {
        totalSpent: 580,
        totalQuantity: 21,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 110, quantity: 5, pricePercentage: 19.0 },
          { type: FoodTypes.Fruits, totalCost: 90, quantity: 3, pricePercentage: 15.5 },
          { type: FoodTypes.Grain, totalCost: 80, quantity: 6, pricePercentage: 13.8 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5, pricePercentage: 43.1 },
          { type: FoodTypes.Dairy, totalCost: 50, quantity: 2, pricePercentage: 8.6 },
        ],
      },
      October: {
        totalSpent: 620,
        totalQuantity: 23,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 130, quantity: 6, pricePercentage: 21.0 },
          { type: FoodTypes.Fruits, totalCost: 90, quantity: 3, pricePercentage: 14.5 },
          { type: FoodTypes.Grain, totalCost: 80, quantity: 6, pricePercentage: 12.9 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5, pricePercentage: 40.3 },
          { type: FoodTypes.Dairy, totalCost: 70, quantity: 3, pricePercentage: 11.3 },
        ],
      },
      November: {
        totalSpent: 590,
        totalQuantity: 22,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 120, quantity: 6, pricePercentage: 20.3 },
          { type: FoodTypes.Fruits, totalCost: 90, quantity: 4, pricePercentage: 15.3 },
          { type: FoodTypes.Grain, totalCost: 70, quantity: 5, pricePercentage: 11.9 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5, pricePercentage: 42.4 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 2, pricePercentage: 10.2 },
        ],
      },
      December: {
        totalSpent: 600,
        totalQuantity: 24,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 130, quantity: 6, pricePercentage: 21.7 },
          { type: FoodTypes.Fruits, totalCost: 90, quantity: 4, pricePercentage: 15.0 },
          { type: FoodTypes.Grain, totalCost: 80, quantity: 5, pricePercentage: 13.3 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5, pricePercentage: 8.3 },
        ],
      },
    },
  },
};


export type {
  FoodGroupInfo,
  MonthlyData,
  YearlyOverview,
  UserData,
  ApiResponse,
};
