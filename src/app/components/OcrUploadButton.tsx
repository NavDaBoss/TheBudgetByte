'use client';

import '../styles/OcrUploadButton.css';
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { db, auth } from '../firebase/firebaseConfig'; // Import Firestore config
import { collection, addDoc, updateDoc } from 'firebase/firestore'; // Import Firestore methods

// MUI
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { updateUsersYearlyOverview } from '../analytics/updateYearlyData';

// Specify types
type GroceryItem = {
  itemName: string;
  itemPrice: number;
  quantity: number;
  foodGroup: string;
  totalPrice: number;
};

type OpenAIResponse = {
  groceryStore: string;
  receiptDate: string;
  groceries: GroceryItem[];
  receiptBalance: number;
};

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
  const currentUser = auth.currentUser;

  // Sends request to ../api/openai/route.js to handle prompting
  const openaiTextExtraction = async (
    promptText: string,
  ): Promise<OpenAIResponse | null> => {
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log('API Response received:', data.response); // Log the response from the server
        return data.response;
      } else {
        console.log('API error received:', data.error); // Log the response from the server
        return null;
      }
    } catch (err) {
      console.log('API error received:', err); // Log the response from the server
      return null;
    }
  };

  // Handle dialog open
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
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

      // Send the Raw OCR data as a prompt to ChatGPT
      const apiResponse = await openaiTextExtraction(result.data.text);

      // Send the result to Firestore (to 'receiptData' collection)
      if (apiResponse) {
        // Calculate receiptBalance based on the groceries array
        // const receiptBalance = apiResponse.groceries.reduce((sum, item) => sum + item.totalPrice, 0);
        const receiptBalance = parseFloat(apiResponse.groceries.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)); // Rounds

        const docRef = await addDoc(collection(db, 'receiptData'), {
          groceryStore: apiResponse.groceryStore,
          receiptDate: apiResponse.receiptDate,
          receiptBalance: receiptBalance,
          submittedTimestamp: new Date(),
          fileName: selectedImage.name,
          userID: currentUser.uid,
        });

        await updateDoc(docRef, { receiptID: docRef.id });
        console.log('OCR result saved to Firestore');
        console.log('docRef.id = ', docRef.id);

        // Reference 'groceries' subcollection to main document
        const groceriesSubCollectionRef = collection(docRef, 'groceries');

        // Loop through each dictionary in groceries
        apiResponse.groceries.forEach(async (item: GroceryItem) => {
          await addDoc(groceriesSubCollectionRef, {
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            quantity: item.quantity,
            foodGroup: item.foodGroup,
            totalPrice: item.totalPrice,
          });
        });

        updateUsersYearlyOverview(
          apiResponse.groceries,
          apiResponse.receiptDate,
        );
      }
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
