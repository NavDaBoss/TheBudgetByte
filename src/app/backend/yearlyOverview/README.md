## UpdateUsersYearlyOverview

- This function takes in the receipt data right after it is parsed, and increments the signed in user's yearlyOverview with the values from the receipts. The values that are updated are:

The below will be updated for the given year:

- totalReceipts (incremented by 1)
- totalSpent
- quantity

The below will be updated for the given month:

- totalReceipts
- totalSpent
- totalQuantity

Each foodGroup in the array of foodGroups[] in the given month will have the below update:

- quantity
- totalCost
- price percentage (the foodGroup's totalCost/ the month's totalSpent)

If a grocery item has a price of <= 0, or has an empty string in the "foodGroup" field, or the "foodGroup" field contains an item that is not one of the foodTypes listend in yearlyOverviewInterface, it will be **skipped**.

If an invalid date is given, ie a date not in the dd/mm/yyyy or dd/mm/yy format, the receipt data will not be updated into the yearlyOverview.
The months and years within yearlyOverview are **not sorted** in any order, when data is displayed, you must sort the years and months yourself if needed.
