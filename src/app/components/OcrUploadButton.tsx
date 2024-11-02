'use client';

import '../styles/OcrUploadButton.css';
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { db } from '../firebase/firebaseConfig'; // Import Firestore config
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

// MUI
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

// For my MUI Upload Button
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Define the component as a reusable upload button
export default function OcrUploadButton() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // For Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // For OpenAI API
  const [gptPrompt, setPrompt] = useState('');
  const [gptResponse, setResponse] = useState('');
  const [gptError, setError] = useState('');
  // const instruction = `This is extracted text from a receipt. Please extract the item name, item price, 
  // item quantity, grocery store, total receipt balance, and the date of the receipt. If you cannot find 
  // certain information, please put N/A.`;

  // SENDS REQUEST TO API AND RECEIVES RESPONSE
  const handleSubmit = async (promptText) => {
    try {
      // const promptText = 'Give me a hex color for blue.';
      // setPrompt(promptText);
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await res.json();

      if (res.ok) {
        setResponse(data.response); // response now contains a string
        console.log('API response received IN CLIENT:', data.response); // Log the response from the server
      } else {
        setError(data.error || 'An error occurred.');
        console.log('API error received:', gptError); // Log the response from the server
      }
    } catch (err) {
      setError('Failed to fetch response from API.');
      console.log('API error received:', gptError); // Log the response from the server
    }
  };

  // Handle dialog open
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedImage(null); // Optionally reset the selected image
  };

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
        'eng', // OCR language: English
      );

      console.log('Raw OCR Result:', result.data.text);

      // SEND OPENAI REQUEST WITH THE OCR TEXT
      // const completePrompt = `${result.data.text}\n\n${instruction}`;
      setPrompt(result.data.text);

      // Wait for the state to update and then call handleSubmit
      await handleSubmit(result.data.text);

      type GroceryItem = {
        itemName: string;
        price: number;
      };
      let grocery: GroceryItem[] = [];

      // FOR LINE BY LINE EXTRACTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // Winner so far?
      const pattern = /([A-Za-z\s]+)\s+(\d+\.\d{2})/;
      const text = result.data.text;
      result.data.lines.forEach((line, index) => {
        // console.log(`Line ${index + 1}:`, line.text); // Print the line text
        // console.log(`Confidence: ${line.confidence}`); // Print the line confidence

        // Apply regex to extract item name and price
        const match = line.text.match(pattern);
        if (match) {
          const itemName = match[1].trim(); // Extract the item name
          // const price = parseFloat(match[2]); // Extract and convert the price to a number
          let price = parseFloat(match[2].replace(',', '.'));

          // Push the extracted item name and price into the grocery array
          grocery.push({
            itemName: itemName,
            price: price,
          });
        }
      });

      // Send the OCR result to Firestore (to 'receiptData' collection)
      await addDoc(collection(db, 'receiptData'), {
        extractedText: grocery,
        timestamp: new Date(),
        fileName: selectedImage.name,
      });
      console.log('OCR result saved to Firestore');
    } catch (error) {
      console.error('Error extracting text or saving to Firestore:', error);
    } finally {
      setLoading(false);
      alert('File extracted and parsed successfully!');
    }
  };

  return (
    <div>
      {/* When Button is clicked, open the Dialog */}
      <Button
        variant="contained"
        onClick={handleDialogOpen}
        className="uploadButton"
      >
        Upload Receipt
      </Button>

      {/* Open/Close Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Upload and Parse Receipt</DialogTitle>
        <DialogContent>
          <p className="ocrRequirements">
            Please ensure the uploaded receipt meets the following requirements
            for best OCR results:
          </p>
          <ul className="listOcrRequirements">
            <li>
              Use a plain, single-color background (e.g., solid black or white)
              with no patterns or textures.
            </li>
            <li>
              Ensure good lighting with minimal shadows for clear text
              visibility.
            </li>
            <li>
              Position the camera directly above the receipt to avoid skewing or
              blurriness.
            </li>
          </ul>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            className="dialogFileButton"
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              multiple
            />
          </Button>
          <TextField
            disabled
            fullWidth
            margin="dense"
            label="Selected File"
            value={selectedImage ? selectedImage.name : 'No file selected'}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleParseImage}
            color="primary"
            disabled={loading || !selectedImage}
            className="dialogParseButton"
          >
            {loading ? 'Processing...' : 'Upload and Parse'}
          </Button>
          <Button
            onClick={handleDialogClose}
            color="secondary"
            className="dialogCloseButton"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
