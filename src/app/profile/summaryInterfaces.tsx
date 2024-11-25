export interface FoodGroup {
  type: string;
  quantity: number;
  totalCost: number;
}

export interface FoodSummary {
  totalCount: number;
  totalCost: number;
}

export interface FoodGroupSummary {
  foodGroups: FoodGroup[];
  summary: FoodSummary;
}

export type AggregatedFoodGroupData = {
  [key: string]: {
    quantity: number;
    totalCost: number;
  };
};
