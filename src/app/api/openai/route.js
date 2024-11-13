import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI();

// Define the schema for a single grocery item
export const groceryItemSchema = z.object({
  itemName: z.string(),
  itemPrice: z.number(),
  quantity: z.number().int(),
  foodGroup: z.string(),
  totalPrice: z.number()
});

export const groceryReceiptExtraction = z.object({
  groceryStore: z.string(),
  receiptDate: z.string(),
  groceries: z.array(groceryItemSchema),
  // receiptBalance: z.number(): this should be calculated dynamically after we scan grocery items
});

export async function POST(request) {
  try {
    // Parse the JSON body from the request
    const { prompt } = await request.json();
    console.log('CHATGPT PROMPT JSON:', prompt);

    // Send the request to OpenAI's API with the provided prompt
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at structured data extraction. You will be given unstructured text from a grocery receipt and should convert it into the given structure. Only extract food items. If you cannot find: groceryStore, receiptBalance, or receiptDate, I want you to put either an empty string or -999. I want you to categorize it into 5 food groups: Fruits, Vegetables, Protein, Grains, and Dairy',
        },
        { role: 'user', content: prompt },
      ],
      response_format: zodResponseFormat(
        groceryReceiptExtraction,
        'grocery_receipt_extraction',
      ),
    });
    console.log('CHATGPT RESPONSE JSON:', completion);
    // console.log(
    //     'CHATGPT MESSAGE CONTENT:',
    //     completion.choices[0].message.content,
    // );
    // Return only the content of the first choice's message
    return NextResponse.json({
      response: completion.choices[0].message.parsed,
    });
  } catch (error) {
    // Handle errors and return a meaningful message to the client
    console.log('OPENAI ROUTE.JS ERROR', error);
    return NextResponse.json(
      { error: 'Failed to fetch completion from OpenAI.' },
      { status: 500 },
    );
  }
}
