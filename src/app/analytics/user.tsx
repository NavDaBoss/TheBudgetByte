// Define the type for the individual food group items
interface FoodGroupInfo {
    totalCost: number;
    quantity: number;
}

// Define the type for the food groups object
interface FoodGroups {
    veggies: FoodGroupInfo;
    fruits: FoodGroupInfo;
    grain: FoodGroupInfo;
    protein: FoodGroupInfo;
    dairy: FoodGroupInfo;
}

// Define the type for the monthly data
interface MonthlyData {
    totalSpent: number;
    totalQuantity: number;
    foodGroups: FoodGroups[];
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
    display_name: "jennie",
    yearlyOverview: {
        "2024": {
            "January": {
                totalSpent: 450,
                totalQuantity: 15,
                foodGroups: [
                    {
                        veggies: { totalCost: 80, quantity: 4 },
                        fruits: { totalCost: 50, quantity: 3 },
                        grain: { totalCost: 60, quantity: 5 },
                        protein: { totalCost: 200, quantity: 3 },
                        dairy: { totalCost: 60, quantity: 2 }
                    }
                ]
            },
            "February": {
                totalSpent: 400,
                totalQuantity: 14,
                foodGroups: [
                    {
                        veggies: { totalCost: 70, quantity: 3 },
                        fruits: { totalCost: 60, quantity: 4 },
                        grain: { totalCost: 50, quantity: 4 },
                        protein: { totalCost: 150, quantity: 2 },
                        dairy: { totalCost: 70, quantity: 1 }
                    }
                ]
            },
            "March": {
                totalSpent: 480,
                totalQuantity: 18,
                foodGroups: [
                    {
                        veggies: { totalCost: 90, quantity: 4 },
                        fruits: { totalCost: 70, quantity: 4 },
                        grain: { totalCost: 60, quantity: 5 },
                        protein: { totalCost: 200, quantity: 3 },
                        dairy: { totalCost: 60, quantity: 2 }
                    }
                ]
            },
            "April": {
                totalSpent: 530,
                totalQuantity: 20,
                foodGroups: [
                    {
                        veggies: { totalCost: 100, quantity: 5 },
                        fruits: { totalCost: 80, quantity: 5 },
                        grain: { totalCost: 70, quantity: 4 },
                        protein: { totalCost: 200, quantity: 4 },
                        dairy: { totalCost: 80, quantity: 2 }
                    }
                ]
            },
            "May": {
                totalSpent: 600,
                totalQuantity: 25,
                foodGroups: [
                    {
                        veggies: { totalCost: 120, quantity: 6 },
                        fruits: { totalCost: 90, quantity: 5 },
                        grain: { totalCost: 70, quantity: 5 },
                        protein: { totalCost: 200, quantity: 6 },
                        dairy: { totalCost: 120, quantity: 3 }
                    }
                ]
            }
        },
        "2023": {
            "January": {
                totalSpent: 500,
                totalQuantity: 18,
                foodGroups: [
                    {
                        veggies: { totalCost: 100, quantity: 3 },
                        fruits: { totalCost: 50, quantity: 2 },
                        grain: { totalCost: 50, quantity: 5 },
                        protein: { totalCost: 250, quantity: 5 },
                        dairy: { totalCost: 100, quantity: 3 }
                    }
                ]
            },
            "February": {
                totalSpent: 450,
                totalQuantity: 16,
                foodGroups: [
                    {
                        veggies: { totalCost: 90, quantity: 4 },
                        fruits: { totalCost: 60, quantity: 3 },
                        grain: { totalCost: 40, quantity: 4 },
                        protein: { totalCost: 200, quantity: 3 },
                        dairy: { totalCost: 60, quantity: 2 }
                    }
                ]
            },
            "March": {
                totalSpent: 550,
                totalQuantity: 20,
                foodGroups: [
                    {
                        veggies: { totalCost: 110, quantity: 5 },
                        fruits: { totalCost: 70, quantity: 4 },
                        grain: { totalCost: 60, quantity: 6 },
                        protein: { totalCost: 250, quantity: 4 },
                        dairy: { totalCost: 60, quantity: 1 }
                    }
                ]
            },
            "April": {
                totalSpent: 400,
                totalQuantity: 15,
                foodGroups: [
                    {
                        veggies: { totalCost: 80, quantity: 3 },
                        fruits: { totalCost: 40, quantity: 2 },
                        grain: { totalCost: 50, quantity: 4 },
                        protein: { totalCost: 150, quantity: 4 },
                        dairy: { totalCost: 80, quantity: 2 }
                    }
                ]
            },
            "May": {
                totalSpent: 600,
                totalQuantity: 22,
                foodGroups: [
                    {
                        veggies: { totalCost: 120, quantity: 6 },
                        fruits: { totalCost: 80, quantity: 5 },
                        grain: { totalCost: 70, quantity: 5 },
                        protein: { totalCost: 250, quantity: 4 },
                        dairy: { totalCost: 80, quantity: 2 }
                    }
                ]
            },
            "June": {
                totalSpent: 520,
                totalQuantity: 19,
                foodGroups: [
                    {
                        veggies: { totalCost: 100, quantity: 4 },
                        fruits: { totalCost: 70, quantity: 3 },
                        grain: { totalCost: 60, quantity: 5 },
                        protein: { totalCost: 250, quantity: 5 },
                        dairy: { totalCost: 40, quantity: 2 }
                    }
                ]
            },
            "July": {
                totalSpent: 580,
                totalQuantity: 21,
                foodGroups: [
                    {
                        veggies: { totalCost: 110, quantity: 5 },
                        fruits: { totalCost: 90, quantity: 4 },
                        grain: { totalCost: 80, quantity: 6 },
                        protein: { totalCost: 200, quantity: 5 },
                        dairy: { totalCost: 100, quantity: 1 }
                    }
                ]
            },
            "August": {
                totalSpent: 550,
                totalQuantity: 20,
                foodGroups: [
                    {
                        veggies: { totalCost: 100, quantity: 4 },
                        fruits: { totalCost: 70, quantity: 4 },
                        grain: { totalCost: 60, quantity: 5 },
                        protein: { totalCost: 200, quantity: 4 },
                        dairy: { totalCost: 120, quantity: 3 }
                    }
                ]
            },
            "September": {
                totalSpent: 500,
                totalQuantity: 18,
                foodGroups: [
                    {
                        veggies: { totalCost: 100, quantity: 5 },
                        fruits: { totalCost: 60, quantity: 4 },
                        grain: { totalCost: 50, quantity: 4 },
                        protein: { totalCost: 200, quantity: 4 },
                        dairy: { totalCost: 90, quantity: 1 }
                    }
                ]
            },
            "October": {
                totalSpent: 550,
                totalQuantity: 20,
                foodGroups: [
                    {
                        veggies: { totalCost: 100, quantity: 6 },
                        fruits: { totalCost: 70, quantity: 4 },
                        grain: { totalCost: 60, quantity: 5 },
                        protein: { totalCost: 200, quantity: 4 },
                        dairy: { totalCost: 120, quantity: 1 }
                    }
                ]
            },
            "November": {
                totalSpent: 600,
                totalQuantity: 25,
                foodGroups: [
                    {
                        veggies: { totalCost: 120, quantity: 7 },
                        fruits: { totalCost: 80, quantity: 5 },
                        grain: { totalCost: 70, quantity: 5 },
                        protein: { totalCost: 200, quantity: 7 },
                        dairy: { totalCost: 120, quantity: 3 }
                    }
                ]
            },
            "December": {
                totalSpent: 700,
                totalQuantity: 30,
                foodGroups: [
                    {
                        veggies: { totalCost: 150, quantity: 8 },
                        fruits: { totalCost: 100, quantity: 6 },
                        grain: { totalCost: 80, quantity: 5 },
                        protein: { totalCost: 200, quantity: 8 },
                        dairy: { totalCost: 170, quantity: 3 }
                    }
                ]
            }
        }
    },
    user: undefined
};

export type {
    FoodGroupInfo,
    FoodGroups,
    MonthlyData,
    YearlyOverview,
    UserData,
    ApiResponse,
};