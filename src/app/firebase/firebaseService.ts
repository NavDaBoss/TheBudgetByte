import {
  collection,
  query,
  where,
  orderBy,
  limit,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  QuerySnapshot,
  DocumentReference,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export interface GroceryItem {
  itemName: string;
  itemPrice: string;
  foodGroup: string;
  quantity: number;
}

export interface Receipt {
  userID: string;
  submittedTimestamp: number;
  receiptBalance: number;
}

/**
 * Adds a new grocery item to a receipt's subcollection.
 * @param {string} receiptID - The ID of the receipt.
 * @param {GroceryItem} groceryData - The grocery item data to add.
 * @return {Promise<string>} The ID of the addded grocery document.
 */
export const addGroceryItem = async (
  receiptID: string,
  groceryData: GroceryItem,
) => {
  try {
    const groceriesRef = collection(db, 'receiptData', receiptID, 'groceries');
    const docRef: DocumentReference = await addDoc(groceriesRef, groceryData);
    console.log(`Added grocery item with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.log(`Error adding grocery item:`, error);
    throw new Error('Failed to add grocery item');
  }
};

/**
 * Deletes a grocery item from a receipt's subcollection.
 * @param {string} receiptID - The ID of the receipt.
 * @param {string} groceryID - The ID of the grocery item to delete.
 * @return {Promise<void>}
 */
export const deleteGroceryItem = async (
  receiptID: string,
  groceryID: string,
): Promise<void> => {
  try {
    const groceryDocRef = doc(
      db,
      'receiptData',
      receiptID,
      'groceries',
      groceryID,
    );
    await deleteDoc(groceryDocRef);
    console.log(`Deleted grocery item with ID: ${groceryID}`);
  } catch (error) {
    console.error('Error deleting grocery item:', error);
    throw new Error('Failed to delete grocery item');
  }
};

/**
 * Fetches the most recent receipt for a user.
 * @param {string} userID - The ID of the user.
 * @return {Promise<QuerySnapshot>} A query snapshot containing the receipt data.
 **/
export const getMostRecentReceipt = async (
  userID: string,
): Promise<QuerySnapshot> => {
  try {
    const receiptRef = collection(db, 'receiptData');
    const q = query(
      receiptRef,
      where('userID', '==', userID),
      orderBy('submittedTimestamp', 'desc'),
      limit(1),
    );
    return await getDocs(q); // Returns a query snapshot
  } catch (error) {
    console.log('Error fetching most recent receipt:', error);
    throw new Error('Error fetching most recent receipt');
  }
};

/**
 * Fetches the groceries subcollection for a specific receipt.
 * @param {string} receiptID - The ID of the receipt.
 * @return {Promise<QuerySnapshot>} A query snapshot containing the grocery
 * items.
 */
export const getGroceriesSubcollection = async (
  receiptID: string,
): Promise<QuerySnapshot> => {
  try {
    const groceriesRef = collection(db, 'receiptData', receiptID, 'groceries');
    return await getDocs(groceriesRef); // Returns a query snapshot
  } catch (error) {
    console.error('Error fetching groceries subcollection:', error);
    throw new Error('Error fetching groceries subcollection');
  }
};

/**
 * Updates a specific field in a grocery document for a given receipt.
 * @param {string} receiptID - The ID of the receipt document.
 * @param {string} groceryID - The ID of the grocery document to update.
 * @param {string} fieldName - The name of the field to update.
 * @param {*} value - The new value for the field.
 * @return {Promise<void>}
 */
export const updateGroceryField = async (
  receiptID: string,
  groceryID: string,
  fieldName: keyof GroceryItem,
  value: GroceryItem[keyof GroceryItem],
): Promise<void> => {
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

/**
 * Updates the total balance of a receipt.
 * @param {string} receiptID - The ID of the receipt document.
 * @param {number} totalCost - The new total cost to set for the receipt.
 * @return {Promise<void>}
 */
export const updateReceiptBalance = async (
  receiptID: string,
  totalCost: number,
): Promise<void> => {
  try {
    const receiptDocRef = doc(db, 'receiptData', receiptID);
    await updateDoc(receiptDocRef, { receiptBalance: totalCost });
    console.log(`Updated receipt balance: $${totalCost}`);
  } catch (error) {
    console.error('Error updating receipt balance:', error);
  }
};
