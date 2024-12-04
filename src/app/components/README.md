# Components

## Table of Contents

- [Overview](#overview)
- [Components](#components)
  - [Summary](#summary)
  - [Receipt](#receipt)
- [Usage](#usage)
  - [AnalyticsSummary](#analyticssummary)
  - [Profile](#profile)
- [How It Works](#how-it-works)

## Overview

The `components` folder contains React components that render visualizations
and user interactions for grocery receipts, spending summaries, and other key data.
These components include chart visualizations, food group breakdowns,
and functions for adding, updating, and deleting grocery items.

## Components

### `Summary.tsx`

The `Summary` component is responsible for displaying a graphical representation
of grocery spending. It uses a **Doughnut Chart** and a **Bar Chart** to visualize spending
across different food groups and the total amount spent.

#### Props

- `data`: Array of food group data containing the name, quantity, total cost, and price percentage.
- `totalCost`: The total cost of all grocery items in the current receipt.

### `Receipt.tsx`

The `Receipt` component allows users to view, add, update, and delete grocery
items associated with a receipt. It supports features like filtering, sorting,
and inline editing of grocery items.

#### Props

- `groceries`: Array of grocery items for the current receipt.
- `onUpload`: Function to handle receipt uploads.
- `onUpdate`: Function to handle updates to grocery items (e.g., price, quantity).
- `onAdd`: Function to add a new grocery item.
- `onDelete`: Function to delete a grocery item.
- `receiptDate`: The date of the current receipt.

### `OcrUploadButton.tsx`

The `OcrUploadButton` component handles uploading a receipt image, using Tesseract OCR to extract text from the image, calling `api/openai` to extract valuable information from the raw OCR text, and finally saving the extracted data to Firestore. It uses MUI Dialog and Date Picker components for a user-friendly interface.

#### Props

- `onUploadComplete`: An optional callback function that is called after the receipt upload and save process is successfully completed.

## Usage

### Example usage in `Dashboard` page:

The `Receipt` component is used in the dashboard view to manage and edit grocery
items, as well as view associated receipt details.

```tsx
<Receipt
  groceries={groceries}
  onUpload={handleReceiptUpload}
  onUpdate={handleUpdateGrocery}
  onAdd={handleAddGroceryItem}
  onDelete={handleDeleteGroceryItem}
  receiptDate={selectedDate}
/>
```

### Example usage in `Analytics` page:

The `Summary` component is used in various pages like the `Analytics` and
`Profile` page to display visualizations of grocery data, such as in monthly or yearly overviews.

```tsx
<Summary
  data={monthlyData[selectedMonth].foodGroups}
  totalCost={monthlyData[selectedMonth].totalSpent}
/>
```

### Example usage in `Profile` page:

The `Summary` component is also used in the `Profile` page to render a user's
overall food group breakdown and total spending.

```tsx
<Summary data={foodGroupSummary.foodGroups} totalCost={totalAmount} />
```

### Example usage of OcrUploadButton

```tsx
import React from 'react';
import OcrUploadButton from './OcrUploadButton';

export default function App() {
  const handleUploadComplete = () => {
    console.log('Receipt upload and save completed!');
  };

  return (
    <div>
      <h1>Upload Your Receipt</h1>
      <OcrUploadButton onUploadComplete={handleUploadComplete} />
    </div>
  );
}
```
