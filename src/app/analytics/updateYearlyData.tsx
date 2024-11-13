import {
  groceryItemSchema,
  groceryReceiptExtraction,
} from '../api/openai/route';
import { z } from 'zod';
import { auth, db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
  doc,
} from 'firebase/firestore';
import {
  FoodTypes,
  MonthlyData,
  YearlyOverview,
  YearlyOverviewData,
} from './yearlyOverviewInterface';

type GroceryItem = z.infer<typeof groceryItemSchema>;
type ReceiptDate = z.infer<typeof groceryReceiptExtraction>['receiptDate'];

// if the user has no yearly overview, create it, otherwise get it
const createOrGetYearlyOverview = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  const fetchOrCreateYearlyOverview = async () => {
    try {
      console.log('trying to query for yearly overview');
      // query for user's yearly overview
      const receiptsRef = collection(db, 'yearlyOverview');
      const q = query(receiptsRef, where('userID', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      // Yearly overview exists, so retrieve and return it
      if (!querySnapshot.empty) {
        console.log('returning an existing yearlyoverview');
        const docData = querySnapshot.docs[0].data() as YearlyOverview;
        return docData;
      }
      // Create a yearly overview for the user
      const newYearlyOverviewData: YearlyOverviewData = {};
      const overviewRef = collection(db, 'yearlyOverview');

      const docRef = await addDoc(overviewRef, {
        yearlyOverviewId: '',
        userID: currentUser.uid,
        yearlyOverviewData: newYearlyOverviewData,
      });

      await updateDoc(docRef, { yearlyOverviewId: docRef.id });
      console.log('returning a newly created yearlyoverview');
      // Return the new yearly overview
      return {
        yearlyOverviewId: docRef.id,
        userID: currentUser.uid,
        yearlyOverviewData: newYearlyOverviewData,
      };
    } catch (error) {
      console.error('Error fetching or creating yearly overview:', error);
      return null;
    }
  };
  return fetchOrCreateYearlyOverview();
};

// Get the year from the receipt.
const getYearFromReceiptDate = (receiptDate: string): string | null => {
  // Regular expression to match mm/dd/yyyy or mm/dd/yy formats
  const dateRegex = /^(0[1-9]|1[0-2])\/([0-2][0-9]|3[01])\/(\d{2}|\d{4})$/;

  const match = receiptDate.match(dateRegex);
  if (match) {
    const year = match[3];
    // If it's a 2-digit year (yy), assume it's 20xx
    if (year.length === 2) {
      return (2000 + parseInt(year, 10)).toString();
    }
    // If it's a 4-digit year (yyyy), just return it
    return year;
  }
  // If the date is not in the correct format, return null
  return null;
};

// Get the month from the receipt.
const getMonthFromReceiptDate = (receiptDate: string): string | null => {
  // Regular expression to match mm or m (for single digit months) and extract the month
  const monthRegex = /^(\d{1,2})\//;

  const match = receiptDate.match(monthRegex);
  if (match) {
    const month = parseInt(match[1], 10);
    // Validate the month (should be between 1 and 12)
    if (month >= 1 && month <= 12) {
      const monthNames = [
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
      return monthNames[month - 1];
    }
  }
  // If the date is not in the correct format, return null
  return null;
};

// Get the specified year's overview if it exists, else create it.
const createOrGetYearData = (overview: YearlyOverview, year: string) => {
  if (year in overview.yearlyOverviewData) {
    return overview.yearlyOverviewData[year];
  } else {
    // Create an overview for the given year, then return it.
    overview.yearlyOverviewData[year] = {};
    return overview.yearlyOverviewData[year];
  }
};

// Get the specified month's overview if it exists, else create it.
const createOrGetMonthData = (
  yearOverview: { [month: string]: MonthlyData },
  month: string,
) => {
  if (month in yearOverview) {
    return yearOverview[month];
  } else {
    // Create an overview for the given month with empty values, then return it.
    yearOverview[month] = {
      totalSpent: 0,
      totalQuantity: 0,
      foodGroups: [],
    };
    return yearOverview[month];
  }
};

// Update the user's food group data for the month, creates a new food group entry if it doesn't exist
const updateFoodGroups = (
  monthOverview: MonthlyData,
  foodGroupsTotalCost: Record<FoodTypes, number>,
  foodGroupsTotalQuantity: Record<FoodTypes, number>,
) => {
  // No need to update when there is no spending.
  if (monthOverview.totalSpent <= 0) {
    console.log('Monthly data was not updated since the total spent <= 0.');
    return;
  }
  for (const foodType of Object.values(FoodTypes)) {
    const existingGroup = monthOverview.foodGroups.find(
      (group) => group.type === foodType,
    );
    if (existingGroup) {
      existingGroup.totalCost += foodGroupsTotalCost[foodType];
      existingGroup.quantity += foodGroupsTotalQuantity[foodType];
      existingGroup.pricePercentage = Number(
        ((existingGroup.totalCost / monthOverview.totalSpent) * 100).toFixed(2),
      );
    } else {
      // Add new entry if the foodGroup doesn't exist
      monthOverview.foodGroups.push({
        type: foodType,
        totalCost: foodGroupsTotalCost[foodType],
        quantity: foodGroupsTotalQuantity[foodType],
        pricePercentage: Number(
          (
            (foodGroupsTotalCost[foodType] / monthOverview.totalSpent) *
            100
          ).toFixed(2),
        ),
      });
    }
  }
};

// Updates the user's yearly overview with the cost and quantity of groceries from the parsed receipts.
export const updateUsersYearlyOverview = async (
  groceries: GroceryItem[],
  receiptDate: ReceiptDate,
) => {
  const year = getYearFromReceiptDate(receiptDate);
  const month = getMonthFromReceiptDate(receiptDate);
  const overview = await createOrGetYearlyOverview();
  if (!overview || !year || !month) {
    console.log('could not find an overview, year, or month');
    return;
  }
  const yearOverview = createOrGetYearData(overview, year);
  const monthOverview = createOrGetMonthData(yearOverview, month);
  let foodGroupsTotalCost: Record<FoodTypes, number> = {
    [FoodTypes.Vegetables]: 0,
    [FoodTypes.Fruits]: 0,
    [FoodTypes.Grains]: 0,
    [FoodTypes.Protein]: 0,
    [FoodTypes.Dairy]: 0,
  };
  let foodGroupsTotalQuantity: Record<FoodTypes, number> = {
    [FoodTypes.Vegetables]: 0,
    [FoodTypes.Fruits]: 0,
    [FoodTypes.Grains]: 0,
    [FoodTypes.Protein]: 0,
    [FoodTypes.Dairy]: 0,
  };
  for (const grocery of groceries) {
    if (
      grocery.foodGroup === '' ||
      !Object.values(FoodTypes).includes(
        (grocery.foodGroup as FoodTypes) || grocery.totalPrice < 0,
      )
    ) {
      continue;
    }
    // Type assertion: Ensure foodGroup is a key in foodGroupsTotalCost.
    const foodGroup = grocery.foodGroup as keyof typeof foodGroupsTotalCost;

    // Update total cost of the corresponding food group.
    if (foodGroupsTotalCost[foodGroup] !== undefined) {
      foodGroupsTotalCost[foodGroup] += grocery.totalPrice;
      foodGroupsTotalQuantity[foodGroup] += grocery.quantity;
    }
  }
  // Take the values in totalcost/quantity and sum them up.
  const totalSpent = Object.values(foodGroupsTotalCost).reduce(
    (sum, cost) => sum + cost,
    0,
  );
  const totalQuantity = Object.values(foodGroupsTotalQuantity).reduce(
    (sum, cost) => sum + cost,
    0,
  );
  console.log('total spent' + totalSpent);
  console.log('total quantitity' + totalQuantity);
  // Update month overview and food groups with new totals
  monthOverview.totalSpent =
    Math.round((monthOverview.totalSpent + totalSpent) * 100) / 100;
  monthOverview.totalQuantity += totalQuantity;
  updateFoodGroups(monthOverview, foodGroupsTotalCost, foodGroupsTotalQuantity);
  console.log(yearOverview);
  // Update firestore with the new yearlyoverview changes
  try {
    const overviewRef = doc(db, 'yearlyOverview', overview.yearlyOverviewId); // Get the correct doc reference
    await updateDoc(overviewRef, {
      [`yearlyOverviewData.${year}.${month}`]: monthOverview, // Use dot notation to update the specific month
    });
    console.log('Yearly overview updated successfully.');
  } catch (error) {
    console.error('Error updating yearly overview in Firebase:', error);
  }
};
