import { render, screen } from '@testing-library/react';
import Register from '@/app/register/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

afterEach(() => {
  // Clear all mock calls and instances after each test
  jest.clearAllMocks();
  jest.resetModules();
});

test('renders Register Page', () => {
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push });

  render(<Register />);

  // Targeting the specific h1 element with "Register"
  const registerHeader = screen.getByRole('heading', { name: /Register/i });
  expect(registerHeader).toBeInTheDocument();

  // Verifying other elements
  expect(screen.getByPlaceholderText(/Display Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getAllByPlaceholderText(/Password/i)[0]).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Already have an Account\?/i)).toBeInTheDocument();
});
