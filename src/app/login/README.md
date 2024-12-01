# Login Page

## Login

- This function handles the logic to display the login page as well as the user sign-in workflow. This includes logging in through BudgetByte's account creation and the Google sign-in provider. It also provides the user the ability to send a password reset email, in the event that they happen to forget their password for their BudgetByte account.

## googleSignIn

- This function handles the Google sign-in using Firebase Authentication. It displays a popup that allows the user to directly sign in to BudgetByte with their Google account. On successful login, the function saves the user data to Firestore and redirects them to the dashboard.

## login

- This function handles email and password login using Firebase Authentication, if the user chose to register an account through BudgetByte.
- On successful login, the function will redirect the user to the dashboard.
- Otherwise, it will display a message to the user informing them that either their email or password is invalid.

## forgotPassword

- This function handles the password reset logic if the user forgets the password to their BudgetByte account.
- It will send an email to the user's registered email, prompting them with instructions to reset their password.
- It will display a success or error message informing the user whether the change is reflected or not.
