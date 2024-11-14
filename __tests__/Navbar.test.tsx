// __tests__/Navbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For the "toBeInTheDocument" matcher
import NavBar from '@/app/components/Navbar'; // Adjust the import path as necessary
import { it, describe, expect } from '@jest/globals'; // Use Jest's test methods
import {
  useDashBoardRedirect,
  useProfileRedirect,
  useAnalyticsRedirect,
  useLogout,
} from '@/app/hooks/clientUtils';

jest.mock('../src/app/hooks/clientUtils', () => ({
  useProfileRedirect: jest.fn(),
  useDashBoardRedirect: jest.fn(),
  useAnalyticsRedirect: jest.fn(),
  useLogout: jest.fn(),
}));

describe('NavBar Component', () => {
  it('should have Budget Byte', () => {
    render(<NavBar />);
    const myElem = screen.getByText('Budget Byte'); // Make sure this matches the text in your component
    expect(myElem).toBeInTheDocument();
  });
  it('should call useDashBoardRedirect on Dashboard button click', () => {
    render(<NavBar />);
    const dashboardButton = screen.getByText('Dashboard');
    fireEvent.click(dashboardButton);
    expect(useDashBoardRedirect).toHaveBeenCalled();
  });
  it('should call useAnalyticsRedirect on Analytics button click', () => {
    render(<NavBar />);
    const analyticsButton = screen.getByText('Analytics');
    fireEvent.click(analyticsButton);
    expect(useAnalyticsRedirect).toHaveBeenCalled();
  });
  it('should call useProfileRedirect on Profile button click', () => {
    render(<NavBar />);
    const profileButton = screen.getByText('Profile');
    fireEvent.click(profileButton);
    expect(useProfileRedirect).toHaveBeenCalled();
  });
  it('should call useLogout on Logout button click', () => {
    render(<NavBar />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(useLogout).toHaveBeenCalled();
  });
});
