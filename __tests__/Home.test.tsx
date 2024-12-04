import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers
import Home from '../src/app/page'; // Importing the Home component
import { useRouter } from 'next/navigation'; // Importing useRouter from Next.js

// Mock the Next.js useRouter function
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Home Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    // Create a mock function for router.push
    pushMock = jest.fn();

    // Mock useRouter to return the push function
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('renders the header with the correct logo text', () => {
    render(<Home />);
    const logo = screen.getByText('Budget Byte');
    expect(logo).toBeInTheDocument();
  });

  it('renders the "Try It Out" and "Login" buttons', () => {
    render(<Home />);
    const tryItOutButton = screen.getByText('Try It Out');
    const loginButton = screen.getByText('Login');

    expect(tryItOutButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('navigates to the register page when "Try It Out" is clicked', () => {
    render(<Home />);
    const tryItOutButton = screen.getByText('Try It Out');

    fireEvent.click(tryItOutButton);
    expect(pushMock).toHaveBeenCalledWith('/register');
  });

  it('navigates to the login page when "Login" is clicked', () => {
    render(<Home />);
    const loginButton = screen.getByText('Login');

    fireEvent.click(loginButton);
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('renders images with correct alt text', () => {
    render(<Home />);
    const receiptImage = screen.getByAltText('Receipt Diagram');
    const graphImage = screen.getByAltText('Monthly Spending Graph');
    const pieImage = screen.getByAltText('Lifetime Stats Diagram');

    expect(receiptImage).toBeInTheDocument();
    expect(graphImage).toBeInTheDocument();
    expect(pieImage).toBeInTheDocument();
  });

  it('renders footer with copyright and contact information', () => {
    render(<Home />);
    const copyrightText = screen.getByText('© 2024 BudgetByte');
    const contactText = screen.getByText('Contact us: support@budgetbyte.com');

    expect(copyrightText).toBeInTheDocument();
    expect(contactText).toBeInTheDocument();
  });
});
