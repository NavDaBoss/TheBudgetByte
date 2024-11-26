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
  monthNames,
  FoodTypes,
  MonthlyData,
  YearlyOverview,
  YearlyOverviewData,
} from '../backend/yearlyOverviewInterface';

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
      // query for user's yearly overview
      const receiptsRef = collection(db, 'yearlyOverview');
      const q = query(receiptsRef, where('userID', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      // Yearly overview exists, so retrieve and return it
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data() as YearlyOverview;
        return docData;
      }
      // Create a yearly overview for the user
      const overviewRef = collection(db, 'yearlyOverview');

      const docRef = await addDoc(overviewRef, {
        yearlyOverviewId: '',
        userID: currentUser.uid,
        yearlyOverviewData: {},
      });

      await updateDoc(docRef, { yearlyOverviewId: docRef.id });
      // Return the new yearly overview
      return {
        yearlyOverviewId: docRef.id,
        userID: currentUser.uid,
        yearlyOverviewData: {},
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
    overview.yearlyOverviewData[year] = {
      totalReceipts: 0,
      totalSpent: 0,
      totalQuantity: 0,
      monthlyData: {},
    };
    return overview.yearlyOverviewData[year];
  }
};

// Get the specified month's overview if it exists, else create it.
const createOrGetMonthData = (
  yearOverview: YearlyOverviewData,
  month: string,
) => {
  if (month in yearOverview.monthlyData) {
    return yearOverview.monthlyData[month];
  } else {
    // Create an overview for the given month with empty values, then return it.
    yearOverview.monthlyData[month] = {
      totalReceipts: 0,
      totalSpent: 0,
      totalQuantity: 0,
      foodGroups: [],
    };
    return yearOverview.monthlyData[month];
  }
};

// Update the user's food group data for the month, creates a new food group entry if it doesn't exist
const updateFoodGroups = (
  monthOverview: MonthlyData,
  foodGroupsTotalCost: Record<FoodTypes, number>,
  foodGroupsTotalQuantity: Record<FoodTypes, number>,
) => {
  for (const foodType of Object.values(FoodTypes)) {
    const existingGroup = monthOverview.foodGroups.find(
      (group) => group.type === foodType,
    );
    if (existingGroup) {
      // Don't decrement the cost to negative
      if (
        !(existingGroup.totalCost === 0 && foodGroupsTotalCost[foodType] < 0)
      ) {
        existingGroup.totalCost += foodGroupsTotalCost[foodType];
      }
      if (
        !(existingGroup.quantity === 0 && foodGroupsTotalQuantity[foodType] < 0)
      ) {
        existingGroup.quantity += foodGroupsTotalQuantity[foodType];
      }
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
  const foodGroupsTotalCost: Record<FoodTypes, number> = {
    [FoodTypes.Vegetables]: 0,
    [FoodTypes.Fruits]: 0,
    [FoodTypes.Grains]: 0,
    [FoodTypes.Protein]: 0,
    [FoodTypes.Dairy]: 0,
  };
  const foodGroupsTotalQuantity: Record<FoodTypes, number> = {
    [FoodTypes.Vegetables]: 0,
    [FoodTypes.Fruits]: 0,
    [FoodTypes.Grains]: 0,
    [FoodTypes.Protein]: 0,
    [FoodTypes.Dairy]: 0,
  };
  for (const grocery of groceries) {
    if (
      grocery.foodGroup === '' ||
      grocery.totalPrice < 0 ||
      !Object.values(FoodTypes).includes(grocery.foodGroup as FoodTypes)
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
  // Update year overview with new totals
  yearOverview.totalSpent =
    Math.round((yearOverview.totalSpent + totalSpent) * 100) / 100;
  yearOverview.totalQuantity += totalQuantity;
  yearOverview.totalReceipts += 1;
  // Update month overview and food groups with new totals
  monthOverview.totalSpent =
    Math.round((monthOverview.totalSpent + totalSpent) * 100) / 100;
  monthOverview.totalQuantity += totalQuantity;
  monthOverview.totalReceipts += 1;
  updateFoodGroups(monthOverview, foodGroupsTotalCost, foodGroupsTotalQuantity);
  // Update firestore with the new yearlyoverview changes
  try {
    const overviewRef = doc(db, 'yearlyOverview', overview.yearlyOverviewId); // Get the correct doc reference
    await updateDoc(overviewRef, {
      [`yearlyOverviewData.${year}.totalReceipts`]: yearOverview.totalReceipts,
      [`yearlyOverviewData.${year}.totalSpent`]: yearOverview.totalSpent,
      [`yearlyOverviewData.${year}.totalQuantity`]: yearOverview.totalQuantity,
      [`yearlyOverviewData.${year}.monthlyData.${month}`]: monthOverview, // Use dot notation to update the specific month
    });
  } catch (error) {
    console.error('Error updating yearly overview in Firebase:', error);
  }
};

export const updateOverviewWhenFoodGroupChanged = async (
  receiptDate: ReceiptDate,
  oldFoodGroup: FoodTypes,
  newFoodGroup: FoodTypes,
  price: number,
  quantity: number,
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
  // const copyofoverviewtoprint = JSON.parse(JSON.stringify(monthOverview));
  const foodGroupsTotalCost: Record<FoodTypes, number> = {
    [FoodTypes.Vegetables]: 0,
    [FoodTypes.Fruits]: 0,
    [FoodTypes.Grains]: 0,
    [FoodTypes.Protein]: 0,
    [FoodTypes.Dairy]: 0,
  };
  const foodGroupsTotalQuantity: Record<FoodTypes, number> = {
    [FoodTypes.Vegetables]: 0,
    [FoodTypes.Fruits]: 0,
    [FoodTypes.Grains]: 0,
    [FoodTypes.Protein]: 0,
    [FoodTypes.Dairy]: 0,
  };
  // If the oldFoodGroup is not a food type , then it is initially uncategorized.
  if (!(oldFoodGroup in foodGroupsTotalCost)) {
    foodGroupsTotalCost[newFoodGroup] = price;
    foodGroupsTotalQuantity[newFoodGroup] = quantity;
    yearOverview.totalSpent =
      Math.round((yearOverview.totalSpent + price) * 100) / 100;
    yearOverview.totalQuantity += quantity;
    monthOverview.totalSpent =
      Math.round((monthOverview.totalSpent + price) * 100) / 100;
    monthOverview.totalQuantity += quantity;
  }
  // If the newFoodGroup is not a food type, then is categorizing to uncategorized
  else if (!(newFoodGroup in foodGroupsTotalCost)) {
    foodGroupsTotalCost[oldFoodGroup] = price * -1;
    foodGroupsTotalQuantity[oldFoodGroup] = quantity * -1;
    yearOverview.totalSpent =
      Math.round((yearOverview.totalSpent - price) * 100) / 100;
    yearOverview.totalQuantity -= quantity;
    monthOverview.totalSpent =
      Math.round((monthOverview.totalSpent - price) * 100) / 100;
    monthOverview.totalQuantity -= quantity;
  }
  // Since we are just swapping the food group of a grocery item, the yearly quantity and price does not change
  // Instead the following are changed:
  // * the total cost of the newly selected food group is incremented by item price
  // * the total cost of the old food group is decremented by item price
  // * the total quantity of the newly selected food group is incremented by the item's quantity
  // * the total quantity of the old food group is decremented by the item's quantity
  else {
    foodGroupsTotalCost[oldFoodGroup] = price * -1;
    foodGroupsTotalCost[newFoodGroup] = price;
    foodGroupsTotalQuantity[oldFoodGroup] = quantity * -1;
    foodGroupsTotalQuantity[newFoodGroup] = quantity;
  }
  updateFoodGroups(monthOverview, foodGroupsTotalCost, foodGroupsTotalQuantity);
  // Update firestore with the new yearlyoverview changes
  try {
    const overviewRef = doc(db, 'yearlyOverview', overview.yearlyOverviewId); // Get the correct doc reference
    await updateDoc(overviewRef, {
      [`yearlyOverviewData.${year}.totalSpent`]: yearOverview.totalSpent,
      [`yearlyOverviewData.${year}.totalQuantity`]: yearOverview.totalQuantity,
      [`yearlyOverviewData.${year}.monthlyData.${month}`]: monthOverview, // Use dot notation to update the specific month
    });
  } catch (error) {
    console.error('Error updating yearly overview in Firebase:', error);
  }
};

export const updateOverviewWhenPriceChanged = async (
  receiptDate: ReceiptDate,
  foodGroup: FoodTypes,
  newPrice: number,
  oldPrice: number,
  quantity: number,
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
  // const copyofoverviewtoprint = JSON.parse(JSON.stringify(monthOverview));
  const foodGroupsTotalCost: Record<FoodTypes, number> = {
    [FoodTypes.Vegetables]: 0,
    [FoodTypes.Fruits]: 0,
    [FoodTypes.Grains]: 0,
    [FoodTypes.Protein]: 0,
    [FoodTypes.Dairy]: 0,
  };
  const foodGroupsTotalQuantity: Record<FoodTypes, number> = {
    [FoodTypes.Vegetables]: 0,
    [FoodTypes.Fruits]: 0,
    [FoodTypes.Grains]: 0,
    [FoodTypes.Protein]: 0,
    [FoodTypes.Dairy]: 0,
  };
  // If the foodGroup is not a food type , then it is uncategorized. Overview does not track uncategorized food types.
  if (!(foodGroup in foodGroupsTotalCost)) {
    console.log(
      'attemped to edit the price of an item that is an invalid food type',
    );
    return;
  }
  const spending = (newPrice - oldPrice) * quantity;
  foodGroupsTotalCost[foodGroup] = spending;
  yearOverview.totalSpent =
    Math.round((yearOverview.totalSpent + spending) * 100) / 100;
  monthOverview.totalSpent =
    Math.round((monthOverview.totalSpent + spending) * 100) / 100;
  updateFoodGroups(monthOverview, foodGroupsTotalCost, foodGroupsTotalQuantity);
  // Update firestore with the new yearlyoverview changes
  try {
    const overviewRef = doc(db, 'yearlyOverview', overview.yearlyOverviewId); // Get the correct doc reference
    await updateDoc(overviewRef, {
      [`yearlyOverviewData.${year}.totalSpent`]: yearOverview.totalSpent,
      [`yearlyOverviewData.${year}.monthlyData.${month}`]: monthOverview, // Use dot notation to update the specific month
    });
  } catch (error) {
    console.error('Error updating yearly overview in Firebase:', error);
  }
};
