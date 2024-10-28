// pages/api/upload-ocr.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import Tesseract from 'tesseract.js';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable since we are using formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    // Parse the FormData request to get the image file
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the file:', err);
        return res.status(500).json({ message: 'Error parsing the file' });
      }

      // Formidable treats each file field as an array of File objects
      // Ensure the file is provided and is a single file
      const imageFileArray = files.photo as File[] | undefined;
      if (!imageFileArray || imageFileArray.length === 0) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Access the file
      const imageFile = imageFileArray[0];

      // Read the image file into a buffer
      const imageBuffer = fs.readFileSync(imageFile.filepath);

      // Run OCR using Tesseract
      const result = await Tesseract.recognize(
        imageBuffer,
        'eng',
        { logger: (m) => console.log(m) }
      );

      const text = result.data.text;

      // Save the result to Firestore
      const docRef = await addDoc(collection(db, 'receiptData'), {
        extractedText: text,
        timestamp: new Date(),
      });

      // Return the OCR result and the Firestore document ID
      res.status(200).json({
        message: 'OCR successful',
        extractedText: text,
        documentId: docRef.id,
      });
    });
  } catch (error) {
    console.error('Error processing OCR or saving to Firestore:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}
