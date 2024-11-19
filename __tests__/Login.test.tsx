import { render, screen, fireEvent } from '@testing-library/react';
import Login from '@/app/login/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

afterEach(() => {
  // Clear all mock calls and instances after each test
  jest.clearAllMocks();
  jest.resetModules();
});

test('renders Login Page', () => {
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push });

  render(<Login />);

  // Targeting the specific h1 element with "Login"
  const loginHeader = screen.getByRole('heading', { name: /Login/i });
  expect(loginHeader).toBeInTheDocument();

  // Verifying other elements
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Forgot Password\?/i)).toBeInTheDocument();
});

test('redirects to dashboard after login', async () => {
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push });

  render(<Login />);
  fireEvent.click(screen.getByRole('button', { name: /Login/i }));

  expect(push).toHaveBeenCalledWith('/dashboard');
});
