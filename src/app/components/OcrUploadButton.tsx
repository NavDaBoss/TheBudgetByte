'use client';

import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { db } from '../firebase/firebaseConfig'; // Import Firestore config
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

// Define the component as a reusable upload button
export default function OcrUploadButton() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);  // Manage loading state

  // Function to clean up unnecessary lines and characters
  // function cleanReceiptText(lines: Tesseract.Line[]): Tesseract.Line[] {
  //   return lines.filter(line => 
  //     !/(TOTAL|TAX|APPROVED|SUBTOTAL|CHANGE|INSTANT SAVINGS|SEQ#|AID:|VISA|Whse|Trm|Trn|Items Sold|Please Come Again)/i.test(line.text)
  //   );
  // }

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
        // { logger: (m) => console.log(m) }  // Optional logger for debugging
      );

      console.log("Raw OCR Result:", result.data.text)

      type GroceryItem = {
        itemName: string;
        price: number
      }
      let grocery: GroceryItem[] = [];

      // TESTING: Regex pattern to match item name and price

      // For confidence score paragraph
      // const pattern = /(?:\d+\s)?([A-Z\/\-\s]+)\s+(\d{1,2}\.\d{2})/g;

      // const pattern = /([A-Z\/\-\s]+)\s+(\d{1,2}\.\d{2})/;



      // const lineConfidenceThreshold = 80;
      // const lines = result.data.lines.filter(line => line.confidence >= lineConfidenceThreshold);
      // const filteredText = lines.map(line => line.text).join('\n');
      // console.log('Filtered Text:', filteredText);


      // FOR LINE BY LINE EXTRACTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // Winner so far?
      // const pattern = /([A-Za-z\s]+)\s+(\d+\.\d{2})/;
      // const text = result.data.text;
      // result.data.lines.forEach((line, index) => {
      //   // console.log(`Line ${index + 1}:`, line.text); // Print the line text
      //   // console.log(`Confidence: ${line.confidence}`); // Print the line confidence
      //   // console.log(`Bounding Box:`, line.bbox); // Print the bounding box if needed
        
      //   // Apply regex to extract item name and price
      //   const match = line.text.match(pattern);
      //   if (match) {
      //     const itemName = match[1].trim(); // Extract the item name
      //     // const price = parseFloat(match[2]); // Extract and convert the price to a number
      //     let price = parseFloat(match[2].replace(",", "."));
      
      //     // Push the extracted item name and price into the grocery array
      //     grocery.push({
      //       itemName: itemName,
      //       price: price,
      //     });
      //   }
      // });


      // FOR MULTILINE PARAGRAPH EXTRACTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
      const pattern = /(?:\d+\s)?([A-Z\/\-\s]+)\s+(\d{1,2}\.\d{2})/g;
      // const pattern = /(?:\d+\s)?([A-Z0-9\/\-\s]+)\s+(\d{1,2}\.\d{2})/g;


      const confidenceThreshold = 30;  
      const words = result.data.words.filter(word => word.confidence >= confidenceThreshold);
      const filteredText = words.map(word => word.text).join(' ');
      console.log('Filtered Text:', filteredText);
      let match;

      // Use regex to find item and price pairs
      while ((match = pattern.exec(filteredText)) !== null) {
        grocery.push({ itemName: match[1].trim(), price: parseFloat(match[2]) });
      }


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
