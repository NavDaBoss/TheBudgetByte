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

// Add a new grocery item to a receipt's subcollection
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

// Delete a grocery item from a receipt's subcollection
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

// Fetch the most recent receipt for a user
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

// Fetch the groceries subcollection for a specific receipt
export const getGroceriesSubcollection = async (
  receiptId: string,
): Promise<QuerySnapshot> => {
  try {
    const groceriesRef = collection(db, 'receiptData', receiptId, 'groceries');
    return await getDocs(groceriesRef); // Returns a query snapshot
  } catch (error) {
    console.error('Error fetching groceries subcollection:', error);
    throw new Error('Error fetching groceries subcollection');
  }
};

/**
 * Updates a specific field in a grocery document for a given receipt.
 * @param receiptID - The ID of the receipt document.
 * @param groceryID - The ID of the grocery document to update.
 * @param fieldName - The field to update.
 * @param value - The new value for the field.
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
 * @param receiptID - The ID of the receipt document.
 * @param totalCost - The new total cost to set for the receipt.
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
