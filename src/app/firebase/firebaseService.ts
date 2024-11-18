import { db } from '../firebase/firebaseConfig';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

// Fetch the most recent receipt for a user
export const getMostRecentReceipt = async (userId: string) => {
  try {
    const receiptRef = collection(db, 'receiptData');
    const q = query(
      receiptRef,
      where('userID', '==', userId),
      orderBy('submittedTimestamp', 'desc'),
      limit(1),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (error) {
    console.log('Error fetching most recent receipt:', error);
    throw new Error('Error fetching most recent receipt');
  }
};

// Fetch the groceries subcollection for a specific receipt
export const getGroceriesSubcollection = async (receiptId: string) => {
  try {
    const groceriesRef = collection(db, 'receiptData', receiptId, 'groceries');
    const querySnapshot = await getDocs(groceriesRef);
    return querySnapshot;
  } catch (error) {
    console.error('Error fetching groceries subcollection:', error);
    throw new Error('Error fetching groceries subcollection');
  }
};
