import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request) {
  try {
    // Parse the JSON body from the request
    const { prompt } = await request.json();
    console.log('CHATGPT PROMPT JSON:', prompt)

    // Send the request to OpenAI's API with the provided prompt
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });
    console.log('CHATGPT RESPONSE JSON:', completion)
    console.log('CHATGPT MESSAGE CONTENT:', completion.choices[0].message.content)
    // Return only the content of the first choice's message
    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (error) {
    // Handle errors and return a meaningful message to the client
    console.log("OPENAI ROUTE.JS ERROR", error)
    return NextResponse.json({ error: "Failed to fetch completion from OpenAI." }, { status: 500 });
  }
}
