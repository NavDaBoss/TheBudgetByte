import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OcrUploadButton from '@/app/components/OcrUploadButton';

// Mock dependencies
jest.mock('tesseract.js', () => ({
  recognize: jest.fn(() =>
    Promise.resolve({
      data: { text: 'Mock OCR text result' },
    }),
  ),
}));

jest.mock('firebase/firestore', () => ({
  db: {},
  auth: { currentUser: { uid: 'mockUserID' } },
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({ firestore: 'mockedFirestore' })),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock('../src/app/api/openai/route.js', () => jest.fn());

describe('OcrUploadButton', () => {
  test('renders the upload button and dialog', () => {
    render(<OcrUploadButton />);

    // Check if the upload button is rendered
    const uploadButton = screen.getByText('Upload Receipt');
    expect(uploadButton).toBeInTheDocument();

    // Check if dialog content is not initially rendered
    expect(
      screen.queryByText('Upload and Parse Receipt'),
    ).not.toBeInTheDocument();
  });

  test('opens the dialog when the upload button is clicked', () => {
    render(<OcrUploadButton />);

    // Open dialog
    const uploadButton = screen.getByText('Upload Receipt');
    fireEvent.click(uploadButton);

    // Check dialog content
    const dialogTitle = screen.getByText('Upload and Parse Receipt');
    expect(dialogTitle).toBeInTheDocument();
  });

  test('handles file selection and displays the file name', async () => {
    render(<OcrUploadButton />);

    // Open dialog
    fireEvent.click(screen.getByText('Upload Receipt'));

    // Upload a file
    const fileInput = screen.getByLabelText('Upload files');
    const mockFile = new File(['mockContent'], 'mockReceipt.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Check if the file name is displayed
    expect(screen.getByDisplayValue('mockReceipt.jpg')).toBeInTheDocument();
  });

  test('calls the OCR function when parsing the image', async () => {
    render(<OcrUploadButton />);

    // Open dialog
    fireEvent.click(screen.getByText('Upload Receipt'));

    // Upload a file
    const fileInput = screen.getByLabelText('Upload files');
    const mockFile = new File(['mockContent'], 'mockReceipt.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Click the Parse button
    const parseButton = screen.getByText('Upload and Parse');
    fireEvent.click(parseButton);

    await waitFor(() => {
      //expect(screen.getByText('Confirm and Save')).toBeInTheDocument();
      // Ensure Tesseract.recognize was called with the correct arguments
      expect(require('tesseract.js').recognize).toHaveBeenCalledWith(
        mockFile, // The uploaded file
        'eng', // Language for OCR
      );
    });
  });
});
