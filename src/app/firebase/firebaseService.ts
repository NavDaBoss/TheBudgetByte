import {
  collection,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

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

/**
 * Updates a specific field in a grocery document for a given receipt.
 * @param {string} receiptID - The ID of the receipt document.
 * @param {string} groceryID - The ID of the grocery document to update.
 * @param {string} fieldName - The field to update.
 * @param {any} value - The new value for the field.
 */
export const updateGroceryField = async (
  receiptID,
  groceryID,
  fieldName,
  value,
) => {
  try {
    const groceryDocRef = doc(
      db,
      'receiptData',
      receiptID,
      'groceries',
      groceryID,
    );
    await updateDoc(groceryDocRef, { [fieldName]: value });
    console.log(
      `Updated ${fieldName} for groceryID ${groceryID} in receipt ${receiptID}`,
    );
  } catch (error) {
    console.error('Error updating grocery field:', error);
  }
};
