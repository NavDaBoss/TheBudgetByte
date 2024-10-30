export enum FoodTypes{
  Veggies = "Veggies",
  Fruits = "Fruits",
  Grain = "Grain",
  Protein = "Protein",
  Dairy = "Dairy",
}
// Define the type for the individual food group items
interface FoodGroupInfo {
  type: FoodTypes;
  totalCost: number;
  quantity: number;
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
  display_name: 'jennie',
  yearlyOverview: {
    '2024': {
      January: {
        totalSpent: 450,
        totalQuantity: 15,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 80, quantity: 4 },
          { type: FoodTypes.Fruits, totalCost: 50, quantity: 3 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 3 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 2 },
        ],
      },
      February: {
        totalSpent: 400,
        totalQuantity: 14,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 70, quantity: 3 },
          { type: FoodTypes.Fruits, totalCost: 60, quantity: 4 },
          { type: FoodTypes.Grain, totalCost: 50, quantity: 4 },
          { type: FoodTypes.Protein, totalCost: 150, quantity: 2 },
          { type: FoodTypes.Dairy, totalCost: 70, quantity: 1 },
        ],
      },
      March: {
        totalSpent: 480,
        totalQuantity: 18,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 90, quantity: 4 },
          { type: FoodTypes.Fruits, totalCost: 70, quantity: 4 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 3 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 2 },
        ],
      },
      April: {
        totalSpent: 530,
        totalQuantity: 20,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 5 },
          { type: FoodTypes.Fruits, totalCost: 80, quantity: 5 },
          { type: FoodTypes.Grain, totalCost: 70, quantity: 4 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 4 },
          { type: FoodTypes.Dairy, totalCost: 80, quantity: 2 },
        ],
      },
      May: {
        totalSpent: 600,
        totalQuantity: 25,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 120, quantity: 6 },
          { type: FoodTypes.Fruits, totalCost: 90, quantity: 5 },
          { type: FoodTypes.Grain, totalCost: 70, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 6 },
          { type: FoodTypes.Dairy, totalCost: 120, quantity: 3 },
        ],
      },
    },
    '2023': {
      January: {
        totalSpent: 500,
        totalQuantity: 18,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 3 },
          { type: FoodTypes.Fruits, totalCost: 50, quantity: 2 },
          { type: FoodTypes.Grain, totalCost: 50, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5 },
          { type: FoodTypes.Dairy, totalCost: 100, quantity: 3 },
        ],
      },
      February: {
        totalSpent: 450,
        totalQuantity: 16,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 90, quantity: 4 },
          { type: FoodTypes.Fruits, totalCost: 60, quantity: 3 },
          { type: FoodTypes.Grain, totalCost: 40, quantity: 4 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 3 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 2 },
        ],
      },
      March: {
        totalSpent: 550,
        totalQuantity: 20,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 110, quantity: 5 },
          { type: FoodTypes.Fruits, totalCost: 70, quantity: 4 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 6 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 4 },
          { type: FoodTypes.Dairy, totalCost: 60, quantity: 1 },
        ],
      },
      April: {
        totalSpent: 400,
        totalQuantity: 15,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 80, quantity: 3 },
          { type: FoodTypes.Fruits, totalCost: 40, quantity: 2 },
          { type: FoodTypes.Grain, totalCost: 50, quantity: 4 },
          { type: FoodTypes.Protein, totalCost: 150, quantity: 4 },
          { type: FoodTypes.Dairy, totalCost: 80, quantity: 2 },
        ],
      },
      May: {
        totalSpent: 600,
        totalQuantity: 22,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 120, quantity: 6 },
          { type: FoodTypes.Fruits, totalCost: 80, quantity: 5 },
          { type: FoodTypes.Grain, totalCost: 70, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 4 },
          { type: FoodTypes.Dairy, totalCost: 80, quantity: 2 },
        ],
      },
      June: {
        totalSpent: 520,
        totalQuantity: 19,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 4 },
          { type: FoodTypes.Fruits, totalCost: 70, quantity: 3 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 250, quantity: 5 },
          { type: FoodTypes.Dairy, totalCost: 40, quantity: 2 },
        ],
      },
      July: {
        totalSpent: 580,
        totalQuantity: 21,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 110, quantity: 5 },
          { type: FoodTypes.Fruits, totalCost: 90, quantity: 4 },
          { type: FoodTypes.Grain, totalCost: 80, quantity: 6 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 5 },
          { type: FoodTypes.Dairy, totalCost: 100, quantity: 1 },
        ],
      },
      August: {
        totalSpent: 550,
        totalQuantity: 20,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 4 },
          { type: FoodTypes.Fruits, totalCost: 70, quantity: 4 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 4 },
          { type: FoodTypes.Dairy, totalCost: 120, quantity: 3 },
        ],
      },
      September: {
        totalSpent: 500,
        totalQuantity: 18,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 5 },
          { type: FoodTypes.Fruits, totalCost: 60, quantity: 4 },
          { type: FoodTypes.Grain, totalCost: 50, quantity: 4 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 4 },
          { type: FoodTypes.Dairy, totalCost: 90, quantity: 1 },
        ],
      },
      October: {
        totalSpent: 550,
        totalQuantity: 20,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 100, quantity: 6 },
          { type: FoodTypes.Fruits, totalCost: 70, quantity: 4 },
          { type: FoodTypes.Grain, totalCost: 60, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 4 },
          { type: FoodTypes.Dairy, totalCost: 120, quantity: 1 },
        ],
      },
      November: {
        totalSpent: 600,
        totalQuantity: 25,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 120, quantity: 7 },
          { type: FoodTypes.Fruits, totalCost: 80, quantity: 5 },
          { type: FoodTypes.Grain, totalCost: 70, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 7 },
          { type: FoodTypes.Dairy, totalCost: 120, quantity: 3 },
        ],
      },
      December: {
        totalSpent: 700,
        totalQuantity: 30,
        foodGroups: [
          { type: FoodTypes.Veggies, totalCost: 150, quantity: 8 },
          { type: FoodTypes.Fruits, totalCost: 100, quantity: 6 },
          { type: FoodTypes.Grain, totalCost: 80, quantity: 5 },
          { type: FoodTypes.Protein, totalCost: 200, quantity: 8 },
          { type: FoodTypes.Dairy, totalCost: 170, quantity: 3 },
        ],
      },
    },
  },
  user: undefined,
};

export type {
  FoodGroupInfo,
  MonthlyData,
  YearlyOverview,
  UserData,
  ApiResponse,
};
