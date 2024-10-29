'use client';

import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { db } from '../../firebase/firebaseConfig'; // Import Firestore config
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

// Define the component as a reusable upload button
export default function OcrUploadButton() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);  // Manage loading state

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
    }
  };

  // Handle OCR parsing and sending to Firestore
  const handleParseImage = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    try {
      const result = await Tesseract.recognize(
        selectedImage,
        'eng',  // OCR language: English
        { logger: (m) => console.log(m) }  // Optional logger for debugging
      );

      type GroceryItem = {
        itemName: string;
        price: number
      }
      let grocery: GroceryItem[] = [];
      // Regex pattern to match item name and price
      const pattern = /\b\d{6,}\s+([A-Za-z\s]+)\s+(\d+\.\d{2})/;

      // const text = result.data.text;
      result.data.lines.forEach((line, index) => {
        console.log(`Line ${index + 1}:`, line.text); // Print the line text
        console.log(`Confidence: ${line.confidence}`); // Print the line confidence
        // console.log(`Bounding Box:`, line.bbox); // Print the bounding box if needed
        
        // Apply regex to extract item name and price
        const match = line.text.match(pattern);
        if (match) {
          const itemName = match[1].trim(); // Extract the item name
          const price = parseFloat(match[2]); // Extract and convert the price to a number
      
          // Push the extracted item name and price into the grocery array
          grocery.push({
            itemName: itemName,
            price: price,
          });
        }
      });
  
      // Create a formatted string with line breaks
      // let formattedText = result.data.lines.map((line) => line.text).join('\n')

      // Create a formatted string with line breaks
      // let formattedText = result.data.lines.map((line) => line.text).join('\n'); // Join lines with new line character

      // setOcrResult(formattedText)

      // Send the OCR result to Firestore (to your 'receiptData' collection)
      await addDoc(collection(db, 'receiptData'), {
        extractedText: grocery,
        timestamp: new Date(),
        fileName: selectedImage.name, // Optional: Save the file name
      });
      console.log('OCR result saved to Firestore');

    } catch (error) {
      console.error('Error extracting text or saving to Firestore:', error);
    } finally {
      setLoading(false);
      alert("File extracted and parsed successfully!");
    }
  };

  return (
    <div>
      {/* Image Upload Input */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {/* Button to trigger OCR */}
      <button onClick={handleParseImage} disabled={loading || !selectedImage}>
        {loading ? 'Processing...' : 'Upload and Parse'}
      </button>
    </div>
  );
}
