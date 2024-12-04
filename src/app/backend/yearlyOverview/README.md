# updateYearlyData.tsx

## updateUsersYearlyOverview()

Params:

- groceries: GroceryItem[],
- receiptDate: ReceiptDate,

- This function takes in the receipt data right after it is parsed and the date is confirmed. It increments the signed in user's yearlyOverview with the values from the receipts. The values that are updated are:

The below will be updated for the given year and month:

- totalReceipts (incremented by 1)
- totalSpent
- quantity

Each foodGroup in the array of foodGroups[] in the given month will have the below update:

- quantity
- totalCost
- price percentage (the foodGroup's totalCost/ the month's totalSpent)

If a grocery item has a price of <= 0, or has an empty string in the "foodGroup" field, or the "foodGroup" field contains an item that is not one of the foodTypes listend in yearlyOverviewInterface, it will be **skipped**.

If an invalid date is given, ie a date not in the dd/mm/yyyy or dd/mm/yy format, the receipt data will not be updated into the yearlyOverview.

The months and years within yearlyOverview are **not sorted** in any order, when data is displayed, you must sort the years and months yourself if needed.

## updateOverviewWhenFoodGroupChanged()

Params:

- receiptDate: ReceiptDate,
- oldFoodGroup: FoodTypes,
- newFoodGroup: FoodTypes,
- price: number,
- quantity: number,

This function updates the user's overview at the date's year and month if the user selects a new foodGroup for a grocery item on the website's dashboard after the receipt is parsed. It will switch the price and quantities associated with the old and new food group. the old/new FoodGroup params can either be a valid foodType as defined in yearlyoverviewInterface.tsx or be "Uncategorized." There is special modifications to the overview when it is "Uncategorized" as listed below, reasons why will be discussed after the list.

The values that are updated are:

The below will be updated for the given year (if the old or new food group is uncategorized):

- totalSpent
- quantity

The below will be updated for the given month (if the old or new food group is uncategorized):

- totalSpent
- totalQuantity

Relevant foodGroups in the array of foodGroups[] in the given month will have the below updates always:
( the old group will have its values decremented by the params, and new group will have its values incremented)

- quantity
- totalCost ( calculated by the params quantity \* price)
- price percentage (the foodGroup's totalCost/ the month's totalSpent)

Since the overview doesn't track uncategorized items, labeling an item from a valid food group to uncategorized is effectively the same as **deleting the item** from the overview. Similarly going from uncategorized to a valid food group is the same as **adding an item**. That is why the year and month total spent/quantity must be updated if an uncategorized type is involved.

If an invalid date is given, ie a date not in the dd/mm/yyyy or dd/mm/yy format, the receipt data will not be updated into the yearlyOverview.

## updateOverviewWhenPriceChanged()

Params:

- receiptDate: ReceiptDate,
- foodGroup: FoodTypes,
- newPrice: number,
- oldPrice: number,
- quantity: number,

This function updates the user's overview at the date's year and month if the user changes an item's price. The value to be added to the totalSpent is calculated using (newPrice - oldPrice) \* quantity. This function will decrement if the oldPrice is more than the newPrice, showing that the item decreased in price, and will increment the other way around.

The below are updated:

- Year's totalSpent
- Month's totalSpent
- foodGroup's totalSpent in given Month
- foodGroup's pricePercentage in given Month

If an invalid date is given, ie a date not in the dd/mm/yyyy or dd/mm/yy format, the receipt data will not be updated into the yearlyOverview.

## updateOverviewWhenQuantityChanged()

Params:

- receiptDate: ReceiptDate,
- foodGroup: FoodTypes,
- newQuantity: number,
- oldQuantity: number,
- price: number,

This function updates the user's overview at the date's year and month if the user changes an item's quantity. It calculates the amount to be incremented or decremented from the spending, and the amount to be incremented or decremented fro the quantity. The amount to be changed in the spending is calculated by (newQuantity - oldQuantity) \* price.

The below will be updated for the given year and month:

- totalSpent
- quantity

Relevant foodGroup in the given month will have the below updates:

- quantity
- totalCost
- price percentage (the foodGroup's totalCost/ the month's totalSpent)

If an invalid date is given, ie a date not in the dd/mm/yyyy or dd/mm/yy format, the receipt data will not be updated into the yearlyOverview.
