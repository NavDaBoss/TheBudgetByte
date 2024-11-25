import { updateUsersYearlyOverview } from '@/app/backend/updateYearlyData';
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

const emptyOverviewTemplate = {
  yearlyOverviewId: 'yearlyOverviewId',
  userID: '123',
  yearlyOverviewData: {},
};
const emptyMonthTemplate = {
  totalSpent: 0,
  totalQuantity: 0,
  totalReceipts: 0,
  foodGroups: [],
};

const emptyYearTemplate = {
  totalSpent: 0,
  totalQuantity: 0,
  totalReceipts: 0,
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
  getDocs: jest.fn().mockResolvedValue({
    empty: false,
    docs: [{ data: () => JSON.parse(JSON.stringify(emptyOverviewTemplate)) }],
  }),
}));

describe('updateUsersYearlyOverview', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Mock the return values for external functions
    const mockOverview = JSON.parse(JSON.stringify(emptyOverviewTemplate));
    const emptyMonthOverview = JSON.parse(JSON.stringify(emptyMonthTemplate));
    const emptyYearOverview = JSON.parse(JSON.stringify(emptyYearTemplate));
    require('../src/app/backend/updateYearlyData').createOrGetYearlyOverview.mockResolvedValue(
      mockOverview,
    );
    require('../src/app/backend/updateYearlyData').fetchOrCreateYearlyOverview.mockResolvedValue(
      mockOverview,
    );
    require('../src/app/backend/updateYearlyData').createOrGetYearData.mockResolvedValue(
      emptyYearOverview,
    );
    require('../src/app/backend/updateYearlyData').createOrGetMonthData.mockResolvedValue(
      emptyMonthOverview,
    );
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
  it('should stop if total spent is <= 0', async () => {
    const mockInvalidGroceries = [
      {
        itemName: 'Carrot',
        itemPrice: 5,
        quantity: 2,
        foodGroup: '',
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
        itemName: 'Chicken Breast',
        itemPrice: 10,
        quantity: 3,
        foodGroup: 'Uncategorized',
        totalPrice: 30,
      },
    ];
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await updateUsersYearlyOverview(mockInvalidGroceries, '01/01/2024');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Monthly data was not updated since the total spent <= 0.',
    );
    consoleSpy.mockRestore();
  });
});
