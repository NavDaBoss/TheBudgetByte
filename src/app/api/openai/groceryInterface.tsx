import { z } from 'zod';

// Define the schema for a single grocery item
export const groceryItemSchema = z.object({
  itemName: z.string(),
  itemPrice: z.number(),
  quantity: z.number().int(),
  foodGroup: z.string(),
  totalPrice: z.number(),
});

export const groceryReceiptExtraction = z.object({
  receiptDate: z.string(),
  groceries: z.array(groceryItemSchema),
});
