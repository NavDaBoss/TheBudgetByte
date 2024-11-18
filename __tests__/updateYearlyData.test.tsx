import { updateUsersYearlyOverview } from '@/app/analytics/updateYearlyData';
import { updateDoc } from 'firebase/firestore';
import { FoodTypes } from '@/app/analytics/yearlyOverviewInterface';

const mockOverview = {
  yearlyOverviewId: 'yearlyOverviewId',
  userID: '123',
  yearlyOverviewData: {
    '2024': {
      totalSpent: 0,
      totalQuantity: 0,
      totalReceipts: 0,
      monthlyData: {},
    },
  },
};

let mockYearOverview = {
  totalSpent: 0,
  totalQuantity: 0,
  totalReceipts: 0,
};

let mockMonthOverview = {
  totalSpent: 0,
  totalQuantity: 0,
  totalReceipts: 0,
};

// Mock dependencies
jest.mock('../src/app/analytics/updateYearlyData', () => {
  const actualModule = jest.requireActual(
    '../src/app/analytics/updateYearlyData',
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
    docs: [{ data: () => mockOverview }],
  }),
}));

describe('updateUsersYearlyOverview', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Mock the return values for external functions

    require('../src/app/analytics/updateYearlyData').createOrGetYearlyOverview.mockResolvedValue(
      mockOverview,
    );
    require('../src/app/analytics/updateYearlyData').fetchOrCreateYearlyOverview.mockResolvedValue(
      mockOverview,
    );
    require('../src/app/analytics/updateYearlyData').createOrGetYearData.mockResolvedValue(
      mockYearOverview,
    );
    require('../src/app/analytics/updateYearlyData').createOrGetMonthData.mockResolvedValue(
      mockMonthOverview,
    );
  });

  it('should update the yearly and monthly overview with grocery data', async () => {
    const mockGroceries = [
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
    await updateUsersYearlyOverview(mockGroceries, '01/01/2024');

    // Expect firebase updateDoc to be called with the update values
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      'yearlyOverviewData.2024.totalReceipts': 1,
      'yearlyOverviewData.2024.totalSpent': 43,
      'yearlyOverviewData.2024.totalQuantity': 6,
      'yearlyOverviewData.2024.monthlyData.January': updatedMonthOverview,
    });
  });
});
