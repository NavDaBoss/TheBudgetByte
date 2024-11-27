import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Home from '../src/app/page'; // Adjust the import path if necessary
import { jest } from '@jest/globals';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Home Page', () => {
  // Define the mock function with a proper type
  let mockPush: jest.Mock<any, any>;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with the logo and login button', () => {
    render(<Home />);

    const logoElement = screen.getByText(/BUDGET BYTE/i);
    const loginButton = screen.getByText(/Login/i);

    expect(logoElement).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('navigates to /login when the Login button is clicked', () => {
    render(<Home />);

    const loginButton = screen.getByText(/Login/i);
    fireEvent.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('navigates to /login when the Scan Receipt button is clicked', () => {
    render(<Home />);

    const scanButton = screen.getByText(/Scan Receipt/i);
    fireEvent.click(scanButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders the receipt parsing section with the correct text and image', () => {
    render(<Home />);

    const receiptText = screen.getByText(/Smart Receipt Parsing/i);
    const receiptImage = screen.getByAltText(/Receipt Diagram/i);

    expect(receiptText).toBeInTheDocument();
    expect(receiptImage).toBeInTheDocument();
  });

  it('renders the monthly spending analytics section with the correct text and image', () => {
    render(<Home />);

    const analyticsText = screen.getByText(/Monthly Spending Analytics/i);
    const analyticsImage = screen.getByAltText(/Monthly Spending Graph/i);

    expect(analyticsText).toBeInTheDocument();
    expect(analyticsImage).toBeInTheDocument();
  });

  it('renders the lifetime stats section with the correct text and image', () => {
    render(<Home />);

    const lifetimeStatsText = screen.getByText(/Lifetime Stats/i);
    const lifetimeStatsImage = screen.getByAltText(/Lifetime Stats Diagram/i);

    expect(lifetimeStatsText).toBeInTheDocument();
    expect(lifetimeStatsImage).toBeInTheDocument();
  });

  it('renders the footer with contact information', () => {
    render(<Home />);

    const footerText = screen.getByText(/© 2024 BudgetByte/i);
    const contactText = screen.getByText(/Contact Us: BudgetByte@budgetbyte.com/i);

    expect(footerText).toBeInTheDocument();
    expect(contactText).toBeInTheDocument();
  });
});
