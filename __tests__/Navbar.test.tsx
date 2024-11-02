// __tests__/Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For the "toBeInTheDocument" matcher
import NavBar from '@/app/components/Navbar'; // Adjust the import path as necessary
import { it, describe, expect } from '@jest/globals'; // Use Jest's test methods

describe('NavBar Component', () => {
  it('should have Budget Byte', () => {
    render(<NavBar />);
    const myElem = screen.getByText('Budget Byte'); // Make sure this matches the text in your component
    expect(myElem).toBeInTheDocument();
  });
});
