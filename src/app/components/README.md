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
<Summary
  data={foodGroupSummary.foodGroups}
  totalCost={totalAmount}
/>
```
