# Backend
 The `backend` folder contains source code that directly interacts with our Firebase backend through TypeScript API calls. 

## fetchProfileData.ts

### fetchYearlyOverviewData()

Params:

- setFoodGroupSummary: function
- setTotalAmount: function
- setReceiptCount: function

This function accepts three functions that are used to update the states that store their respective data. It fetches yearly overview data for the authenticated user by aggregating total spending, receipt count, and food group data, and then updates each state accordingly.

In terms of the core functionality, it queries through each year (for the totals and receipt count) in the YearlyOverview Data and queries each month (to calculate the lifetime food group summary data) within each year to fetch the relevant data.

### updateProfilePicture()

Params:

- newProfilePic: File
- newName: String
- setIsEditingPic: function

This function accepts three parameters: the file that contains the new profile picture, the display name of the user, and the function that toggles whether the user is currently editing the profile pic or not. It updates the user's profile picture in Firebase Storage and Firestore through a backend API call. The display name is needed to associate the new profile picture with that user.

### updateDisplayName()

Params:

- newName: string
- setIsEditingName: function
- setNameErrorMessage: function

This function accepts three parameters: the display name of the user, the function that toggles whether the user is currently editing their name or not, and the function that sets the error message (if necessary). First, it validates the new display name to ensure that it doesn't exceed twenty characters. Then, it updates the user's display name in Firebase Authentication and Firestore through a backend API call.

### resetUserPassword()

Params:

- currentPassword: string
- newPassword: string
- confirmPassword: string
- setPasswordErrorMessage: function
- setSuccessMessage: function
- router: AppInstanceRouter

This function accepts six parameters: the string that contains the user's current password, the string that contains the user's desired new password, the string that contains the confirmed password (which should match the new password), the function that sets an error message (if necessary), the function that sets a success message, and the NextJS navigation router. This function first validates the new password (ensuring it is at least six characters long and matches the confirmation password) and then validates the current password to ensure that the user is the one that is making this request. It then makes a backend API call to Firebase to update the password, if successful. Lastly, it redirects the user back to the app after two seconds.

## ocrUpload.ts

### saveReceiptDataToFirestore()

```
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
```

Params: 

- apiResponse: OpenAIResponse
- confirmedDate: string
- selectedImage: File
- currentUserUid: string

This functions takes in the above parameters. It first creates a main document in the receiptData collection with the fields:

```
fileName: string
receiptBalance: number
receiptDate: string
receiptID: string
submittedTimestamp: timestamp
```

It then adds a subcollection with documents that contain GroceryItem.

