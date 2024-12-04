import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, updateDoc, DocumentReference } from 'firebase/firestore';
import { updateUsersYearlyOverview } from './yearlyOverview/updateYearlyData';

type GroceryItem = {
  itemName: string;
  itemPrice: number;
  quantity: number;
  foodGroup: string;
  totalPrice: number;
};

type OpenAIResponse = {
  receiptDate: string;
  groceries: GroceryItem[];
};

/**
 * Saves receipt data to Firestore, including groceries subcollection and updates the yearly overview.
 *
 * @param apiResponse - The parsed response containing receipt and groceries data.
 * @param confirmedDate - The confirmed receipt date.
 * @param selectedImage - The selected image file from the user.
 * @param currentUserUid - The UID of the currently authenticated user.
 * @throws Throws an error if required parameters are missing or an operation fails.
 */
export const saveReceiptDataToFirestore = async (
  apiResponse: OpenAIResponse,
  confirmedDate: string,
  selectedImage: File,
  currentUserUid: string
): Promise<void> => {
  if (!apiResponse || !confirmedDate || !selectedImage || !currentUserUid) {
    throw new Error('Missing required parameters');
  }

  try {
    // Add main receipt document
    const receiptDocRef: DocumentReference = await addDoc(collection(db, 'receiptData'), {
      receiptDate: confirmedDate,
      receiptBalance: parseFloat(
        apiResponse.groceries
          .reduce((sum, item) => sum + item.totalPrice, 0)
          .toFixed(2)
      ),
      submittedTimestamp: new Date(),
      fileName: selectedImage.name,
      userID: currentUserUid,
    });
    
    console.log('receiptBalance:', parseFloat(
        apiResponse.groceries
          .reduce((sum, item) => sum + item.totalPrice, 0)
          .toFixed(2)
      ))
    // Update receipt document with receiptID
    await updateDoc(receiptDocRef, { receiptID: receiptDocRef.id });
    console.log('Main receipt data saved with ID:', receiptDocRef.id);

    // Add groceries subcollection
    const groceriesSubCollectionRef = collection(receiptDocRef, 'groceries');

    for (const item of apiResponse.groceries) {
      await addDoc(groceriesSubCollectionRef, {
        itemName: item.itemName,
        itemPrice: item.itemPrice.toFixed(2),
        quantity: item.quantity,
        foodGroup: item.foodGroup,
        totalPrice: item.totalPrice.toFixed(2),
      });
    }

    console.log('Groceries data and yearly overview updated.');
  } catch (error) {
    console.error('Error saving receipt data to Firestore:', error);
    throw error;
  }
};
