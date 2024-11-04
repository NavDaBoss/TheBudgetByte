import '@testing-library/jest-dom';
import 'jest-canvas-mock';

import { jest } from '@jest/globals';
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

// Mock Firebase modules
const mockApp = {};

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => mockApp),
  getApp: jest.fn(() => mockApp),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'mock-uid', displayName: 'Mock User' },
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn((callback) => callback({ uid: 'mock-uid', displayName: 'Mock User' })),
  })),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
  })),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
}));
