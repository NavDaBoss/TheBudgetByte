import { render, screen } from '@testing-library/react';
import Profile from '@/app/profile/page';
import Navbar from '@/app/components/Navbar';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('../src/app/firebase/firebaseConfig', () => ({
  auth: {
    currentUser: {
      displayName: 'Test User',
      email: 'test@example.com',
      photoURL: '/test-image.jpg',
      uid: '123',
    },
  },
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

afterEach(() => {
  // Clear all mock calls and instances after each test
  jest.clearAllMocks();
  jest.resetModules();
});

describe('Renders Profile Page', () => {
  test('renders user information correctly', async () => {
    (usePathname as jest.Mock).mockReturnValue('/profile');

    render(<Navbar />);
    render(<Profile />);

    expect(screen.getByText(/Welcome, Test User!/i)).toBeInTheDocument();

    expect(screen.getByText(/User Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Lifetime Stats/i)).toBeInTheDocument();

    expect(screen.getByText(/Edit Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
  });

  test('Correct User Information Is Displayed', async () => {
    (usePathname as jest.Mock).mockReturnValue('/profile');

    render(<Navbar />);
    render(<Profile />);
    expect(screen.getByText(/Display Name: Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/Email: test@example.com/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Number of Receipts Scanned: 0/i),
    ).toBeInTheDocument();
  });
});
