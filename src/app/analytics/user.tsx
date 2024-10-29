// Define the type for the individual food group items
interface FoodGroup {
    totalCost: number;
    quantity: number;
}

// Define the type for the food groups object
interface FoodGroups {
    veggies: FoodGroup;
    fruits: FoodGroup;
    grain: FoodGroup;
    protein: FoodGroup;
    dairy: FoodGroup;
}

// Define the type for the monthly data
interface MonthlyData {
    totalSpent: number;
    totalQuantity: number;
    "food-groups": FoodGroups[];
}

// Define the type for the yearly overview (with dynamic years)
interface YearlyOverview {
    [year: string]: {
        [month: string]: MonthlyData;
    };
}

// Define the type for the user data
interface UserData {
    display_name: string;
    yearlyOverview: YearlyOverview;
}

// Define the type for the entire JSON response structure
interface ApiResponse {
    user: UserData;
}

export type {
    FoodGroup,
    FoodGroups,
    MonthlyData,
    YearlyOverview,
    UserData,
    ApiResponse,
};