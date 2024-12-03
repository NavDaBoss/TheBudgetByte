import { useState, useEffect, useCallback } from 'react';
import {
  addGroceryItem,
  deleteGroceryItem,
  getMostRecentReceipt,
  getGroceriesSubcollection,
} from '../firebase/firebaseService';

// Define an interface to represent the structure of a grocery item
interface GroceryItem {
  id: string;
  itemName: string;
  itemPrice: string;
  foodGroup: string;
  quantity: number;
}

const useGroceries = (userID: string | null) => {
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [receiptBalance, setReceiptBalance] = useState<number>(0);
  const [receiptDate, setReceiptDate] = useState<number>(0);
  const [receiptID, setReceiptID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const addGrocery = async (newItem: any) => {
    if (!receiptID) return;
    try {
      const groceryID = await addGroceryItem(receiptID, newItem);
      setGroceries((prev) => [...prev, { ...newItem, id: groceryID }]);
    } catch (error) {
      setError('Failed to add grocery item');
    }
  };

  const deleteGrocery = async (groceryID: string) => {
    if (!receiptID) return;
    try {
      await deleteGroceryItem(receiptID, groceryID);
      setGroceries((prev) => prev.filter((item) => item.id !== groceryID));
    } catch (error) {
      setError('Failed to delete grocery item');
    }
  };

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
                ...(doc.data() as GroceryItem),
                id: doc.id,
              }))
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

  const updateGroceryItem = (
    groceryID: string,
    fieldName: keyof GroceryItem,
    value: GroceryItem[keyof GroceryItem] // Fix applied here
  ) => {
    setGroceries((prev) =>
      prev.map((item) =>
        item.id === groceryID ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const setGroceriesState = (updatedGroceries) => {
    setGroceries(updatedGroceries);
  };

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
