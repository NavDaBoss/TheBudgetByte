import {
  groceryItemSchema,
  groceryReceiptExtraction,
} from '../api/openai/route';
import { z } from 'zod';
import { auth, db } from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
} from 'firebase/firestore';
import {
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

// Updates the user's yearly overview with the cost and quantity of groceries from the parsed receipts.
export const updateUsersYearlyOverview = async (
  groceries: GroceryItem[],
  receiptDate: ReceiptDate,
) => {
  const year = getYearFromReceiptDate(receiptDate);
  const month = getMonthFromReceiptDate(receiptDate);
  console.log(year);
  console.log(month);
  const overview = await createOrGetYearlyOverview();
  console.log('overview is: ');
  console.log(overview);
  if (!overview || !year || !month) {
    return;
  }
  const yearOverview = createOrGetYearData(overview, year);
  const monthOverview = createOrGetMonthData(yearOverview, month);
  let foodGroupsTotalCost = {
    Vegetables: 0,
    Fruits: 0,
    Grains: 0,
    Protein: 0,
    Dairy: 0,
  };
  let foodGroupsTotalQuantity = {
    Vegetables: 0,
    Fruits: 0,
    Grains: 0,
    Protein: 0,
    Dairy: 0,
  };
  for (const grocery of groceries) {
    if (grocery.foodGroup === '') {
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
  console.log('total quantity + spent:');
  console.log(totalQuantity);
  console.log(totalSpent);
};
