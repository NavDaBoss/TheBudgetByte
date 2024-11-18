import { useState, useEffect } from 'react';
import {
  getMostRecentReceipt,
  getGroceriesSubcollection,
} from '../firebase/firebaseService';

const useGroceries = (userId: string | null) => {
  const [groceries, setGroceries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMostRecentReceipt = async () => {
      if (userId) {
        setLoading(true);
        try {
          const querySnapshot = await getMostRecentReceipt(userId);
          if (!querySnapshot.empty) {
            const receiptId = querySnapshot.docs[0].id;
            const groceriesSnapshot =
              await getGroceriesSubcollection(receiptId);

            if (!groceriesSnapshot.empty) {
              setGroceries(groceriesSnapshot.docs.map((doc) => doc.data()));
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
    fetchMostRecentReceipt();
  }, [userId]);

  return { groceries, loading, error };
};

export default useGroceries;
