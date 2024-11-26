import {
  updateOverviewWhenFoodGroupChanged,
  updateOverviewWhenPriceChanged,
  updateUsersYearlyOverview,
} from '@/app/backend/updateYearlyData';
import { updateDoc } from 'firebase/firestore';
import { FoodTypes } from '@/app/backend/yearlyOverviewInterface';

const mockValidGroceries = [
  {
    itemName: 'Carrot',
    itemPrice: 5,
    quantity: 2,
    foodGroup: 'Vegetables',
    totalPrice: 10,
  },
  {
    itemName: 'Apple',
    itemPrice: 3,
    quantity: 1,
    foodGroup: 'Fruits',
    totalPrice: 3,
  },
  {
    itemName: 'Chicken Breast',
    itemPrice: 10,
    quantity: 3,
    foodGroup: 'Protein',
    totalPrice: 30,
  },
];

let emptyMonthTemplate = {
  totalSpent: 0,
  totalQuantity: 0,
  totalReceipts: 0,
  foodGroups: [],
};

let emptyYearTemplate = {
  totalSpent: 0,
  totalQuantity: 0,
  totalReceipts: 0,
  monthlyData: {
    January: emptyMonthTemplate,
  },
};

let emptyOverviewTemplate = {
  yearlyOverviewId: 'yearlyOverviewId',
  userID: '1234',
  yearlyOverviewData: {
    '2024': emptyYearTemplate,
  },
};

let populatedMonthTemplate = {
  totalReceipts: 1,
  totalSpent: 20,
  totalQuantity: 10,
  foodGroups: [
    {
      type: FoodTypes.Vegetables,
      totalCost: 4,
      quantity: 2,
      pricePercentage: 20,
    },
    {
      type: FoodTypes.Fruits,
      totalCost: 4,
      quantity: 2,
      pricePercentage: 20,
    },
    {
      type: FoodTypes.Grains,
      totalCost: 4,
      quantity: 2,
      pricePercentage: 20,
    },
    {
      type: FoodTypes.Protein,
      totalCost: 4,
      quantity: 2,
      pricePercentage: 20,
    },
    {
      type: FoodTypes.Dairy,
      totalCost: 4,
      quantity: 2,
      pricePercentage: 20,
    },
  ],
};

let populatedYearTemplate = {
  totalSpent: 20,
  totalQuantity: 10,
  totalReceipts: 1,
  monthlyData: {
    January: populatedMonthTemplate,
  },
};

let populatedOverviewTemplate = {
  yearlyOverviewId: 'yearlyOverviewId',
  userID: '1234',
  yearlyOverviewData: {
    '2024': populatedYearTemplate,
  },
};

// Mock dependencies
jest.mock('../src/app/backend/updateYearlyData', () => {
  const actualModule = jest.requireActual(
    '../src/app/backend/updateYearlyData',
  );
  return {
    ...actualModule,
    fetchOrCreateYearlyOverview: jest.fn(),
    createOrGetYearlyOverview: jest.fn(),
    createOrGetYearData: jest.fn(),
    createOrGetMonthData: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({ firestore: 'mockedFirestore' })),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

describe('updateUsersYearlyOverview', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // returns a mocked overview
    require('firebase/firestore').getDocs.mockResolvedValue({
      empty: false,
      docs: [{ data: () => JSON.parse(JSON.stringify(emptyOverviewTemplate)) }],
    });
  });

  it('should update the yearly and monthly overview with grocery data', async () => {
    const updatedMonthOverview = {
      totalReceipts: 1,
      totalSpent: 43,
      totalQuantity: 6,
      foodGroups: [
        {
          type: FoodTypes.Vegetables,
          totalCost: 10,
          quantity: 2,
          pricePercentage: 23.26,
        },
        {
          type: FoodTypes.Fruits,
          totalCost: 3,
          quantity: 1,
          pricePercentage: 6.98,
        },
        {
          type: FoodTypes.Grains,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
        {
          type: FoodTypes.Protein,
          totalCost: 30,
          quantity: 3,
          pricePercentage: 69.77,
        },
        {
          type: FoodTypes.Dairy,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
      ],
    };
    await updateUsersYearlyOverview(mockValidGroceries, '01/01/2024');

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalReceipts': 1,
      'yearlyOverviewData.2024.totalSpent': 43,
      'yearlyOverviewData.2024.totalQuantity': 6,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });

  it('should skip uncategorized data', async () => {
    const mockGroceries = [
      {
        itemName: 'Carrot',
        itemPrice: 5,
        quantity: 2,
        foodGroup: 'uncategorized',
        totalPrice: 10,
      },
      {
        itemName: 'Apple',
        itemPrice: 3,
        quantity: 1,
        foodGroup: 'Fruits',
        totalPrice: -999,
      },
      {
        itemName: 'Pear',
        itemPrice: 3,
        quantity: 1,
        foodGroup: 'Fruits',
        totalPrice: 5,
      },
    ];

    const updatedMonthOverview = {
      totalReceipts: 1,
      totalSpent: 5,
      totalQuantity: 1,
      foodGroups: [
        {
          type: FoodTypes.Vegetables,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
        {
          type: FoodTypes.Fruits,
          totalCost: 5,
          quantity: 1,
          pricePercentage: 100,
        },
        {
          type: FoodTypes.Grains,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
        {
          type: FoodTypes.Protein,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
        {
          type: FoodTypes.Dairy,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
      ],
    };
    await updateUsersYearlyOverview(mockGroceries, '01/01/2024');

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalReceipts': 1,
      'yearlyOverviewData.2024.totalSpent': 5,
      'yearlyOverviewData.2024.totalQuantity': 1,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });
  it('should stop if there is invalid date', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await updateUsersYearlyOverview(mockValidGroceries, 'NA/NA/2024');
    expect(consoleSpy).toHaveBeenCalledWith(
      'could not find an overview, year, or month',
    );
    consoleSpy.mockRestore();
  });
});

describe('updateOverviewWhenFoodGroupChanged', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // returns a mocked overview
    require('firebase/firestore').getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { data: () => JSON.parse(JSON.stringify(populatedOverviewTemplate)) },
      ],
    });
  });

  it('should edit the monthly overview when both food groups are valid', async () => {
    const updatedMonthOverview = {
      totalReceipts: 1,
      totalSpent: 20,
      totalQuantity: 10,
      foodGroups: [
        {
          type: FoodTypes.Vegetables,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 20,
        },
        {
          type: FoodTypes.Fruits,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 20,
        },
        {
          type: FoodTypes.Grains,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 20,
        },
        {
          type: FoodTypes.Protein,
          totalCost: 8,
          quantity: 4,
          pricePercentage: 40,
        },
        {
          type: FoodTypes.Dairy,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
      ],
    };
    await updateOverviewWhenFoodGroupChanged(
      '01/01/2024',
      FoodTypes.Dairy,
      FoodTypes.Protein,
      4,
      2,
    );

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalSpent': 20,
      'yearlyOverviewData.2024.totalQuantity': 10,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });

  it('should edit the monthly overview with new selected food group where old food group is uncategorized', async () => {
    const updatedMonthOverview = {
      totalReceipts: 1,
      totalSpent: 24,
      totalQuantity: 12,
      foodGroups: [
        {
          type: FoodTypes.Vegetables,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 16.67,
        },
        {
          type: FoodTypes.Fruits,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 16.67,
        },
        {
          type: FoodTypes.Grains,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 16.67,
        },
        {
          type: FoodTypes.Protein,
          totalCost: 8,
          quantity: 4,
          pricePercentage: 33.33,
        },
        {
          type: FoodTypes.Dairy,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 16.67,
        },
      ],
    };
    await updateOverviewWhenFoodGroupChanged(
      '01/01/2024',
      'Uncategorized' as FoodTypes,
      FoodTypes.Protein,
      4,
      2,
    );

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalSpent': 24,
      'yearlyOverviewData.2024.totalQuantity': 12,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });

  it('should edit the monthly overview with new selected food group where old food group is uncategorized', async () => {
    const updatedMonthOverview = {
      totalReceipts: 1,
      totalSpent: 16,
      totalQuantity: 8,
      foodGroups: [
        {
          type: FoodTypes.Vegetables,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Fruits,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Grains,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Protein,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
        {
          type: FoodTypes.Dairy,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
      ],
    };
    await updateOverviewWhenFoodGroupChanged(
      '01/01/2024',
      FoodTypes.Protein,
      'Uncategorized' as FoodTypes,
      4,
      2,
    );
    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalSpent': 16,
      'yearlyOverviewData.2024.totalQuantity': 8,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });

  it('should not update if the total cost is already zero and the price is negative', async () => {
    const updatedMonthOverview = {
      totalReceipts: 1,
      totalSpent: 16,
      totalQuantity: 8,
      foodGroups: [
        {
          type: FoodTypes.Vegetables,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Fruits,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Grains,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Protein,
          totalCost: 0,
          quantity: 0,
          pricePercentage: 0,
        },
        {
          type: FoodTypes.Dairy,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
      ],
    };
    // first zero out the protein field
    await updateOverviewWhenFoodGroupChanged(
      '01/01/2024',
      FoodTypes.Protein,
      'Uncategorized' as FoodTypes,
      4,
      2,
    );
    // try to zero out the protein field again
    await updateOverviewWhenFoodGroupChanged(
      '01/01/2024',
      FoodTypes.Protein,
      'Uncategorized' as FoodTypes,
      4,
      2,
    );

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalSpent': 16,
      'yearlyOverviewData.2024.totalQuantity': 8,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });

  it('should stop if there is invalid date', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await updateOverviewWhenFoodGroupChanged(
      'NA/NA/2024',
      FoodTypes.Protein,
      FoodTypes.Dairy,
      4,
      2,
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'could not find an overview, year, or month',
    );
    consoleSpy.mockRestore();
  });
});

describe('updateOverviewWhenPriceChanged', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // returns a mocked overview
    require('firebase/firestore').getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { data: () => JSON.parse(JSON.stringify(populatedOverviewTemplate)) },
      ],
    });
  });

  it('should update the monthly overview to new totalCost when both price per item is doubled', async () => {
    const updatedMonthOverview = {
      totalReceipts: 1,
      totalSpent: 24,
      totalQuantity: 10,
      foodGroups: [
        {
          type: FoodTypes.Vegetables,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 16.67,
        },
        {
          type: FoodTypes.Fruits,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 16.67,
        },
        {
          type: FoodTypes.Grains,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 16.67,
        },
        {
          type: FoodTypes.Protein,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 16.67,
        },
        {
          type: FoodTypes.Dairy,
          totalCost: 8,
          quantity: 2,
          pricePercentage: 33.33,
        },
      ],
    };
    await updateOverviewWhenPriceChanged(
      '01/01/2024',
      FoodTypes.Dairy,
      /* new price = */ 4,
      /* old price = */ 2,
      /* quantity = */ 2,
    );

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalSpent': 24,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });

  it('should update the monthly overview to new totalCost when item price is 0', async () => {
    const updatedMonthOverview = {
      totalReceipts: 1,
      totalSpent: 16,
      totalQuantity: 10,
      foodGroups: [
        {
          type: FoodTypes.Vegetables,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Fruits,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Grains,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Protein,
          totalCost: 4,
          quantity: 2,
          pricePercentage: 25,
        },
        {
          type: FoodTypes.Dairy,
          totalCost: 0,
          quantity: 2,
          pricePercentage: 0,
        },
      ],
    };
    await updateOverviewWhenPriceChanged(
      '01/01/2024',
      FoodTypes.Dairy,
      /* new price = */ 0,
      /* old price = */ 2,
      /* quantity = */ 2,
    );

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalSpent': 16,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });

  it('should not update the monthly overview when item price is the same', async () => {
    await updateOverviewWhenPriceChanged(
      '01/01/2024',
      FoodTypes.Dairy,
      /* new price = */ 2,
      /* old price = */ 2,
      /* quantity = */ 2,
    );

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalSpent': 20,
      'yearlyOverviewData.2024.monthlyData.January': populatedMonthTemplate,
    });
  });

  it('should stop if there is invalid food type', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await updateOverviewWhenPriceChanged(
      '01/01/2024',
      'Uncategorized' as FoodTypes,
      4,
      2,
      2,
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'attemped to edit the price of an item that is an invalid food type',
    );
    consoleSpy.mockRestore();
  });

  it('should stop if there is invalid date', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await updateOverviewWhenPriceChanged(
      'NA/NA/2024',
      FoodTypes.Protein,
      4,
      2,
      2,
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'could not find an overview, year, or month',
    );
    consoleSpy.mockRestore();
  });
});
