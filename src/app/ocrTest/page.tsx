'use client';

import React, { useState } from 'react';

const OCRTestPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');
    setOcrResult('');

    try {
      // Create a FormData object to hold the image file
      const formData = new FormData();
      formData.append('photo', selectedFile);

      // Send the file to the backend API
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload the image and process OCR.');
      }

      const data = await response.json();
      setOcrResult(data.extractedText);
    } catch (error) {
      console.error('Error uploading and processing OCR:', error);
      setError('Error uploading and processing OCR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload an Image for OCR</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload and Extract Text'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {ocrResult && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{ocrResult}</p>
        </div>
      )}
    </div>
  );
};

export default OCRTestPage;
