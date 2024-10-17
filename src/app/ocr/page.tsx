// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';


// export default function OcrPage() {
//   return (
//     <div>
//       <h1>OCR Page</h1>
//       <p>This is the Optical Character Recognition (OCR) functionality page.</p>
//     </div>
//   );
// };

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Tesseract from 'tesseract.js';  // Import Tesseract.js for OCR

export default function OcrPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string>('');  // State to hold OCR result
  const [loading, setLoading] = useState(false);           // State to manage loading
  
  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
    }
  };

  // Function to parse the image using Tesseract.js
  const handleParseImage = () => {
    if (!selectedImage) return;

    setLoading(true);
    Tesseract.recognize(
      selectedImage,
      'eng',  // Set the language for OCR (English)
      {
        logger: (m) => console.log(m)  // Optional logger to track progress
      }
    )
    .then(({ data: { text } }) => {
      setOcrResult(text);  // Store the parsed text
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error parsing image:', error);
      setLoading(false);
    });
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
