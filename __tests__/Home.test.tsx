import { render, screen, fireEvent } from '@testing-library/react'; // For rendering and testing components
import Home from '../src/app/page'; // Import the Home component
import { useRouter } from 'next/navigation'; // Import useRouter for mocking
import '@testing-library/jest-dom'; // For extended matchers
import { jest } from '@jest/globals';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Defining types for the mocked router
interface MockRouter {
  push: jest.Mock;
}

describe('Home Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn(); // Mocking the router push function
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    } as MockRouter); // Assigning the mock
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('renders the logo correctly', () => {
    render(<Home />);
    const logo = screen.getByText('Budget Byte');
    expect(logo).toBeInTheDocument(); // Verify if the logo is present
  });

  test('renders the Smart Receipt Parsing section', () => {
    render(<Home />);
    const header = screen.getByText('Smart Receipt Parsing');
    expect(header).toBeInTheDocument();
  });

  test('renders Try It Out and Login buttons and navigates correctly', () => {
    render(<Home />);
    const tryItOutButton = screen.getByText('Try It Out');
    const loginButton = screen.getByText('Login');

    expect(tryItOutButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(tryItOutButton); // Simulate a button click
    expect(pushMock).toHaveBeenCalledWith('/login'); // Check if the correct route is pushed

    fireEvent.click(loginButton); // Simulate a button click
    expect(pushMock).toHaveBeenCalledWith('/register'); // Check if the correct route is pushed
  });

  test('renders the Monthly Spending Analytics section', () => {
    render(<Home />);
    const header = screen.getByText('Monthly Spending Analytics');
    expect(header).toBeInTheDocument();
  });

  test('renders the Lifetime Stats section', () => {
    render(<Home />);
    const header = screen.getByText('Lifetime Stats');
    expect(header).toBeInTheDocument();
  });

  test('renders footer with copyright and contact information', () => {
    render(<Home />);
    const copyright = screen.getByText('© 2024 BudgetByte');
    const contact = screen.getByText('Contact us: support@budgetbyte.com');

    expect(copyright).toBeInTheDocument();
    expect(contact).toBeInTheDocument();
  });
});
