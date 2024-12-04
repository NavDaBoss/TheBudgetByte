# Grocery Dashboard

This folder contains the main dashboard components and logic for the Grocery Dashboard application,
where users can view their grocery receipts, manage grocery items,
and track their spending through interactive charts.

## Table of Contents

- [Overview](#overview)
- [Components](#components)
  - [Summary](#summary)
  - [Receipt](#receipt)
- [Hooks](#hooks)
  - [useGroceries](#usegroceries)
- [Firebase Integration](#firebase-integration)
- [How It Works](#how-it-works)

## Overview

The Grocery Dashboard allows users to manage their grocery receipts,
visualize their spending by food group, and track individual grocery items in real time.
It integrates with Firebase for authentication and data management.
The core features include:

- Adding, deleting, and updating grocery items.
- Viewing spending breakdowns with charts (Doughnut and Bar
  charts).
- Fetching the most recent receipt and its associated grocery
  items.

---

## Components

### `Summary.tsx`

This component displays a high-level overview of the
user's grocery spending with two main features:

- **Doughnut Chart**: A graphical representation of the
  percentage of total cost spent on each food group.
- **Bar Chart**: A detailed breakdown of the cost per food
  group.

**Props**:

- `data`: Array of food group data containing the
  name, quantity, total cost, and price percentage.
- `totalCost`: The total cost of all grocery items in
  the current receipt.

**Usage**:
The `Summary` component is used to visualize the
user's grocery spending. It listens for changes in
the `data` (food group breakdown) and `totalCost`,
rendering updated charts whenever the data
changes.

### `Receipt.tsx`

This component manages the list of grocery items associated with a receipt.
It allows users to:

- Add new grocery items.
- Delete existing grocery items.
- Update grocery item details (e.g., price, quantity, food group).

It also supports sorting and filtering of grocery items, as well as file
upload functionality for receipts.

**Props**:

- `groceries`: Array of grocery items for the current receipt.
- `onUpload`: Function to handle receipt uploads.
- `onUpdate`: Function to handle updates to a grocery item.
- `onAdd`: Function to add a new grocery item.
- `onDelete`: Function to delete a grocery item.
- `receiptDate`: The date of the current receipt.

**Usage**:
The `Receipt` component is displayed in the dashboard to allow users to
interact with their grocery items. It includes features like inline editing,
sorting, and the ability to upload receipts.

---

## Hooks

### `useGroceries.ts`

A custom hook that encapsulates the logic for managing grocery items and receipt data.
It interacts with Firebase to fetch, add, update, and delete grocery items.

**Key Methods**:

- `addGrocery`: Adds a new grocery item to the current receipt.
- `deleteGrocery`: Deletes a grocery item from the current receipt.
- `updateGroceryItem`: Updates a specific field (e.g., quantity or price) of a grocery item.
- `fetchMostRecentReceipt`: Fetches the most recent receipt for the user.
- `setGroceriesState`: Replaces the current list of groceries with a new one.

**State Variables**:

- `groceries`: Array of grocery items in the current receipt.
- `receiptBalance`: The total cost of the current receipt.
- `receiptDate`: Timestamp of when the receipt was submitted.
- `receiptID`: The ID of the current receipt.
- `loading`: Boolean indicating if the data is being loaded.
- `error`: Error message, if any.

**Usage**:
This hook is used across various components like `Summary` and `Receipt` to fetch
and manage data related to groceries and receipts.

---

## Firebase Integration

The dashboard relies on Firebase services for authentication and data storage.
The key Firebase functions used in this folder are:

- **Firestore**:

- `addGroceryItem`: Adds a new grocery item to a receipt's subcollection.
- `deleteGroceryItem`: Deletes a grocery item from a receipt.
- `getMostRecentReceipt`: Fetches the most recent receipt for a user.
- `getGroceriesSubcollection`: Fetches all grocery items for a specific receipt.
- `updateGroceryField`: Updates a specific field (e.g., price or quantity) of a grocery item.
- `updateReceiptBalance`: Updates the total balance of a receipt.

---

## How It Works

### User Authentication:

- Users authenticate using Firebase Authentication (Google or email/password).
- After logging in, the app fetches the most recent receipt for the user using
  the `useGroceries` hook, which calls `getMostRecentReceipt` from `firebaseService.ts`.

### Managing Groceries:

#### Adding a Grocery Item:

- A user can add a new grocery item via the `addGrocery` function in the `useGroceries` hook.
- This function calls `addGroceryItem` in `firebaseService.ts`, which adds the item to Firestore.
  After the item is added, the local state (`groceries`) is updated.

#### Deleting a Grocery Item:

- A user can delete a grocery item via the `deleteGrocery` function in the `useGroceries` hook.
- This function calls `deleteGroceryItem` in `firebaseService.ts` to
  remove the item from Firestore, and the local state is updated.

#### Updating a Grocery Item:

- A user can update a specific field of a grocery item (e.g., quantity, price)
  through the `updateGroceryItem` function in the `useGroceries` hook,
  which updates the Firestore document.

### Visualizing Data:

- The `Summary.tsx` component uses the data fetched by the `useGroceries` hook to render two charts:
  - A Doughnut chart showing the percentage breakdown of spending by food group.
  - A Bar chart showing the exact costs of each food group.

### Real-time Data Sync:

- The app continuously syncs with Firestore, so any changes made to groceries or receipts are reflected in real-time.
