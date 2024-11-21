import { useState, useEffect } from 'react';
import {
  getMostRecentReceipt,
  getGroceriesSubcollection,
  updateGroceryField,
} from '../firebase/firebaseService';

const useGroceries = (userID: string | null) => {
  const [groceries, setGroceries] = useState<any[]>([]);
  const [receiptID, setReceiptID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMostRecentReceipt = async () => {
    if (userID) {
      setLoading(true);
      try {
        const querySnapshot = await getMostRecentReceipt(userID);
        if (!querySnapshot.empty) {
          const fetchedReceiptID = querySnapshot.docs[0].id;
          setReceiptID(fetchedReceiptID);

          const groceriesSnapshot =
            await getGroceriesSubcollection(fetchedReceiptID);

          if (!groceriesSnapshot.empty) {
            setGroceries(
              groceriesSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                receiptID,
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
  };

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
    updateGroceryItem,
    loading,
    error,
  };
};

export default useGroceries;
