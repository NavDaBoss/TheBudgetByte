# Profile Page

## Profile

- This function handles the logic to display the profile page. This gives users the ability to view and update their information,
  manage profile pictures, reset passwords, and display their lifetime stats.

## formatDate

- This function formats the account creation timestamp into a human readable date string.
- It accepts a timestamp as a parameter and returns the formatted date as a string.

## handleCreationDate

- This function handles the formatted display of the account creation date.
- It returns the formatted creation date or a message displaying that the Date is not available.

## handleClearName

- This function clears the input field for the new display name.

## handleNameChange

- This function updates the new display name state as the input changes.

## handleProfilePicChange

- This function handles the profile picture file selection.

## handleCurrentPasswordChange

- This function updates the current password input fields as the user types.

## handleNewPasswordChange

- This function updates the new password input fields as the user types.

## handleConfirmPasswordChange

- This function updates the confirm password input fields as the user types.

## handleEditNamePopup

- This function opens the edit name modal, allowing the user to edit their display name.

## handleEditResetPasswordPopup

- This function opens the reset password modal, allowing the user to reset their password.

## handleEditProliePicPopup

- This function opens the edit profile picture modal, allowing the user to edit their profile picture.

## handleUpdateProfile

- This function awaits a backend call in order to update the user's profile picture.

## handleUpdateName

- This function awaits a backend call in order to update the user's display name.

## handleResetPassword

- This function awaits a backend call in order to reset the user's password.
