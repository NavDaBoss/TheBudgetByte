'use client';

import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { db } from '../firebase/firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';

export default function OcrPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string>('');  
  const [loading, setLoading] = useState(false);  

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
        'eng', 
        { logger: (m) => console.log(m) }  
      );
      const text = result.data.text;
      setOcrResult(text);

      // Send the OCR result to Firestore (to 'receiptData' collection)
      const docRef = await addDoc(collection(db, 'receiptData'), {
        extractedText: text,
        timestamp: new Date(),
        fileName: selectedImage.name, 
      });
      console.log('Document written with ID:', docRef.id);

    } catch (error) {
      console.error('Error extracting text or saving to Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>OCR Page</h1>
      <p>This page allows you to upload a grocery receipt and parse it using OCR.</p>
      
      {/* Image Upload Input */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {/* Button to trigger OCR */}
      <button onClick={handleParseImage} disabled={loading || !selectedImage}>
        {loading ? 'Processing...' : 'Parse Receipt'}
      </button>
      
      {/* Display OCR result */}
      {ocrResult && (
        <div>
          <h2>Parsed Text:</h2>
          <p>{ocrResult}</p>
        </div>
      )}
    </div>
  );
}
