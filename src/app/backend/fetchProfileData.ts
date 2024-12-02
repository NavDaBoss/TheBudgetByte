import {
  auth,
  db,
  updateProfile,
  doc,
  setDoc,
  storage,
  signInWithEmailAndPassword,
} from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  FoodGroup,
  FoodGroupSummary,
  AggregatedFoodGroupData,
} from '../profile/summaryInterfaces';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword } from '@firebase/auth';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Fetches yearly overview data for the authenticated user.
 * Aggregates total spending, receipt count, and food group data, then updates state accordingly.
 *
 * @param {function} setFoodGroupSummary - Function to update the food group summary state.
 * @param {function} setTotalAmount - Function to update the total amount spent state.
 * @param {function} setReceiptCount - Function to update the receipt count state.
 */

export const fetchYearlyOverviewData = async (
  setFoodGroupSummary: (data: FoodGroupSummary) => void,
  setTotalAmount: (amount: number) => void,
  setReceiptCount: (count: number) => void,
) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return; // Exit if the user is not authenticated
  }
  try {
    const yearlyOverviewRef = collection(db, 'yearlyOverview');
    const q = query(yearlyOverviewRef, where('userID', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);

    let totalSpent = 0;
    let totalReceipts = 0;
    let totalQuantity = 0;
    let totalCost = 0;
    const foodGroupData: AggregatedFoodGroupData = {};

    // Process each document in the query result
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.yearlyOverviewData) {
        const yearlyData = data.yearlyOverviewData;
        Object.keys(yearlyData).forEach((year) => {
          const yearData = yearlyData[year];
          if (yearData.totalSpent) {
            totalSpent += parseFloat(yearData.totalSpent);
          }
          if (yearData.totalReceipts) {
            totalReceipts += parseInt(yearData.totalReceipts, 10);
          }
          // Aggregate food group data by month
          Object.keys(yearData.monthlyData || {}).forEach((month) => {
            const monthData = yearData.monthlyData[month];
            if (monthData.foodGroups) {
              monthData.foodGroups.forEach((foodGroup: FoodGroup) => {
                const { type, quantity, totalCost: itemCost } = foodGroup;
                if (!foodGroupData[type]) {
                  foodGroupData[type] = { quantity: 0, totalCost: 0 };
                }
                foodGroupData[type].quantity += quantity;
                foodGroupData[type].totalCost += itemCost;
                totalQuantity += quantity;
                totalCost += itemCost;
              });
            }
          });
        });
      }
    });

    // Format the aggregated food group data by rounding to 2 decimal places
    const formattedFoodGroups = Object.keys(foodGroupData).map((type) => {
      const { quantity, totalCost: itemCost } = foodGroupData[type];
      return {
        type,
        quantity,
        totalCost: Math.round(itemCost * 100) / 100,
        pricePercentage:
          totalCost > 0 ? Math.round((itemCost / totalCost) * 10000) / 100 : 0,
      };
    });

    // Update states with aggregated data
    const summary = {
      totalCount: totalQuantity,
      totalCost: Math.round(totalCost * 100) / 100,
    };

    setFoodGroupSummary({ foodGroups: formattedFoodGroups, summary });
    setTotalAmount(Math.round(totalSpent * 100) / 100);
    setReceiptCount(totalReceipts);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

/**
 * Updates the user's profile picture in Firebase Storage and Firestore.
 *
 * @param {File | null} newProfilePic - The new profile picture file to upload.
 * @param {string | null} newName - The new display name for the user.
 * @param {Function} setIsEditingPic - Function to toggle the profile picture editing state.
 */
export const updateProfilePicture = async (
  newProfilePic: File | null,
  newName: string | null,
  setIsEditingPic: (state: boolean) => void,
) => {
  const currentUser = auth.currentUser;
  if (currentUser && newProfilePic) {
    try {
      // Upload the profile picture to Firebase Storage
      const picRef = ref(storage, `profilePics/${currentUser.uid}`);
      await uploadBytes(picRef, newProfilePic);
      const imageUrl = await getDownloadURL(picRef);

      // Update the user's profile in Firebase Authentication
      await updateProfile(currentUser, {
        displayName: newName || currentUser.displayName,
        photoURL: imageUrl,
      });

      // Update user's profile to Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userDocRef,
        { displayName: newName, photoURL: imageUrl },
        { merge: true },
      );

      setIsEditingPic(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
};

/**
 * Updates the user's display name in Firebase Authentication and Firestore.
 *
 * @param {string} newName - The new display name to set.
 * @param {Function} setIsEditingName - Function to toggle the name editing state.
 * @param {Function} setNameErrorMessage - Function to display error messages for the name input.
 */
export const updateDisplayName = async (
  newName: string,
  setIsEditingName: (state: boolean) => void,
  setNameErrorMessage: (msg: string) => void,
) => {
  const currentUser = auth.currentUser;
  if (newName && currentUser !== null) {
    try {
      // Validate the display name length
      if (newName.length > 20) {
        setNameErrorMessage('Display Name cannot exceed 20 characters');
        throw new Error('Display Name cannot exceed 20 characters');
      }
      setNameErrorMessage('');
      await updateProfile(currentUser, {
        displayName: newName,
      });
      // Update the display name in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { displayName: newName }, { merge: true });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
};

/**
 * Resets the user's password after verifying the current password.
 *
 * @param {string} currentPassword - The user's current password for reauthentication.
 * @param {string} newPassword - The new password to set.
 * @param {string} confirmPassword - Confirmation of the new password.
 * @param {Function} setPasswordErrorMessage - Function to display password error messages.
 * @param {Function} setSuccessMessage - Function to display a success message upon completion.
 * @param {AppRouterInstance} router - Next.js router instance for navigation.
 */
export const resetUserPassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  setPasswordErrorMessage: (msg: string) => void,
  setSuccessMessage: (msg: string) => void,
  router: AppRouterInstance,
) => {
  // Validate new password and confirmation
  const currentUser = auth.currentUser;
  if (newPassword !== confirmPassword) {
    setPasswordErrorMessage('New password and confirmation do not match.');
    return;
  }

  if (newPassword.length < 6) {
    setPasswordErrorMessage('Password must be at least 6 characters long.');
    return;
  }

  try {
    setSuccessMessage('');
    setPasswordErrorMessage('');
    // Reauthenticate the user with their current password
    if (currentUser && currentUser.email) {
      await signInWithEmailAndPassword(
        auth,
        currentUser.email,
        currentPassword,
      );

      // If authentication is successful, update the password
      await updatePassword(currentUser, newPassword);

      setSuccessMessage('Your password has been updated successfully.');
      // Redirect to login after a delay
      setTimeout(() => {
        setSuccessMessage('');
        router.push('/login');
      }, 2000);
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    setPasswordErrorMessage('Failed to reset password. Please try again.');
  }
};
