'use client';

import { useRouter } from 'next/navigation';
import { auth, signOut } from '../firebase/firebaseConfig';

export const useProfileRedirect = () => {
  const router = useRouter();
  return () => router.push('/profile');
};

export const useDashBoardRedirect = () => {
  const router = useRouter();
  return () => router.push('/dashboard');
};

export const useAnalyticsRedirect = () => {
  const router = useRouter();
  return () => router.push('/analytics');
};

export const useLogout = () => {
  const router = useRouter();
  return async () => {
    await signOut(auth);
    router.push('/login');
  };
};
