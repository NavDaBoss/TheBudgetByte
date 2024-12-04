import { useState, useEffect, useCallback } from 'react';
import {
  addGroceryItem,
  deleteGroceryItem,
  getMostRecentReceipt,
  getGroceriesSubcollection,
} from '../firebase/firebaseService';

export interface GroceryItem {
  id: string;
  itemName: string;
  itemPrice: string;
  foodGroup: string;
  quantity: number;
}

interface Receipt {
  receiptBalance: number;
  receiptDate: number;
  id: string;
}

const useGroceries = (userID: string) => {
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [receiptBalance, setReceiptBalance] = useState<number>(0);
  const [receiptDate, setReceiptDate] = useState<number>(0);
  const [receiptID, setReceiptID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /** Adds a new grocery item to the current receipt.
   * Updates the local state to include the new item.
   */
  const addGrocery = async (newItem: Omit<GroceryItem, 'id'>) => {
    if (!receiptID) return;
    try {
      const groceryID = await addGroceryItem(receiptID, newItem);
      setGroceries((prev) => [...prev, { ...newItem, id: groceryID }]);
    } catch (error) {
      setError('Failed to add grocery item');
    }
  };

  /**
   * Deletes a grocery item from the current receipt.
   * Updates the local state to exclude the deleted item.
   */
  const deleteGrocery = async (groceryID: string) => {
    if (!receiptID) return;
    try {
      await deleteGroceryItem(receiptID, groceryID);
      setGroceries((prev) => prev.filter((item) => item.id !== groceryID));
    } catch (error) {
      setError('Failed to delete grocery item');
    }
  };

  /**
   * Fetches the most recent receipt for the user and its associated groceries.
   * Updates state with the receipt data and groceries.
   */
  const fetchMostRecentReceipt = useCallback(async () => {
    if (userID) {
      setLoading(true);
      try {
        const querySnapshot = await getMostRecentReceipt(userID);
        if (!querySnapshot.empty) {
          const fetchedReceiptID = querySnapshot.docs[0].id;
          setReceiptID(fetchedReceiptID);

          const receiptData = querySnapshot.docs[0].data();
          setReceiptBalance(receiptData.receiptBalance || 0);
          setReceiptDate(receiptData.receiptDate || 0);
          const groceriesSnapshot =
            await getGroceriesSubcollection(fetchedReceiptID);

          if (!groceriesSnapshot.empty) {
            setGroceries(
              groceriesSnapshot.docs.map((doc) => ({
                ...(doc.data() as Omit<GroceryItem, 'id'>),
                id: doc.id,
              })),
            );
          } else {
            setGroceries([]);
          }
        } else {
          setGroceries([]);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
  }, [userID]);

  /**
   * Updates a single field of a grocery item in the local state.
   * @param groceryID - The ID of the grocery item to update.
   * @param fieldName - The field to update.
   * @param value - The new value for the field.
   * */
  const updateGroceryItem = (
    groceryID: string,
    fieldName: keyof GroceryItem,
    value: GroceryItem[keyof GroceryItem],
  ) => {
    setGroceries((prev) =>
      prev.map((item) =>
        item.id === groceryID ? { ...item, [fieldName]: value } : item,
      ),
    );
  };

  /**
   * Replaces the current groceries list with a new list.
   * Useful for batch updates or refreshing the state.
   * @param updatedGroceries: The new groceries list.
   */
  const setGroceriesState = (updatedGroceries: GroceryItem[]) => {
    setGroceries(updatedGroceries);
  };

  // Fetch the most recent receipt and its groceries when the userID changes
  useEffect(() => {
    fetchMostRecentReceipt();
  }, [userID, fetchMostRecentReceipt]);

  return {
    groceries,
    receiptID,
    receiptBalance,
    receiptDate,
    addGrocery,
    deleteGrocery,
    updateGroceryItem,
    setGroceriesState,
    loading,
    error,
    refetch: fetchMostRecentReceipt,
  };
};

export default useGroceries;
