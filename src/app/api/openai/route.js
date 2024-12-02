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
  totalPrice: z.number(),
});

export const groceryReceiptExtraction = z.object({
  receiptDate: z.string(),
  groceries: z.array(groceryItemSchema),
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
            'You are an expert at structured data extraction. You will be given unstructured text from a grocery receipt and should convert it into the given structure. Please format any dates in the style mm/dd/yyyy, if you cannot find the date please put an empty string. Sometimes there will be items that are not food, do not extract those items. For all food, I want you to categorize them into 5 food groups: Fruits, Vegetables, Protein, Grains, and Dairy. If you are unsure of what food group a grocery belongs to, categorize it as Uncategorized.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3, // Controls creativity
      top_p: 0.9, // Focuses output on most probable responses
      response_format: zodResponseFormat(
        groceryReceiptExtraction,
        'grocery_receipt_extraction',
      ),
    });
    console.log('CHATGPT RESPONSE JSON:', completion);
    // Return only the content of the first choice's message
    return NextResponse.json({
      response: completion.choices[0].message.parsed,
    });
  } catch (error) {
    // Handle errors and return a meaningful message to the client
    console.log('OPENAI ROUTE.JS ERROR', error);
    // Enhanced error handling based on OpenAI error codes
    if (error.response) {
      // OpenAI API responded with an error
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return NextResponse.json(
            { error: 'Bad Request: Check the prompt structure or API request.' },
            { status: 400 }
          );
        case 401:
          return NextResponse.json(
            { error: 'Unauthorized: Invalid API key or insufficient permissions.' },
            { status: 401 }
          );
        case 403:
          return NextResponse.json(
            { error: 'Forbidden: You lack access to this resource.' },
            { status: 403 }
          );
        case 404:
          return NextResponse.json(
            { error: 'Not Found: The requested resource could not be found.' },
            { status: 404 }
          );
        case 429:
          return NextResponse.json(
            { error: 'Rate Limit Exceeded: Too many requests. Try again later.' },
            { status: 429 }
          );
        case 500:
          return NextResponse.json(
            { error: 'Internal Server Error: A problem occurred on OpenAI\'s end.' },
            { status: 500 }
          );
        case 503:
          return NextResponse.json(
            { error: 'Service Unavailable: OpenAI is temporarily down.' },
            { status: 503 }
          );
        default:
          return NextResponse.json(
            { error: `Unexpected Error: ${data?.error?.message || 'Unknown error.'}` },
            { status }
          );
      }
    }
  }
}
