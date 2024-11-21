import { useState, useEffect, useCallback } from 'react';
import {
  getMostRecentReceipt,
  getGroceriesSubcollection,
} from '../firebase/firebaseService';

const useGroceries = (userID: string | null) => {
  const [groceries, setGroceries] = useState<any[]>([]);
  const [receiptBalance, setReceiptBalance] = useState(0);
  const [receiptID, setReceiptID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

          const groceriesSnapshot =
            await getGroceriesSubcollection(fetchedReceiptID);

          if (!groceriesSnapshot.empty) {
            setGroceries(
              groceriesSnapshot.docs.map((doc) => ({
                ...doc.data(),
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
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }, [userID]);

  const updateGroceryItem = (
    groceryID: string,
    fieldName: string,
    value: string,
  ) => {
    setGroceries((prev) =>
      prev.map((item) =>
        item.id === groceryID ? { ...item, [fieldName]: value } : item,
      ),
    );
  };

  useEffect(() => {
    fetchMostRecentReceipt();
  }, [userID]);

  return {
    groceries,
    receiptID,
    receiptBalance,
    updateGroceryItem,
    loading,
    error,
    refetch: fetchMostRecentReceipt,
  };
};

export default useGroceries;
