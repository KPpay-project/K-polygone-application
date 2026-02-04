import { ReactNode, useEffect, useState } from 'react';
import { router } from 'expo-router';

type RouteType = {
  caseSensitive: boolean;
  path: string;
  element?: ReactNode;
  children: RouteType[];
};

export function useAppPages() {
  const [pages, setPages] = useState<RouteType[]>([]);

  useEffect(() => {
    // Define your app routes based on Expo Router file structure
    const appRoutes: RouteType[] = [
      {
        caseSensitive: false,
        path: '/',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/account-details',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/account-verification',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/add-money',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/auth/login',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/auth/register',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/onboarding',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/(tabs)/home',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/(tabs)/transactions',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/(tabs)/cards',
        children: [],
      },
      {
        caseSensitive: false,
        path: '/(tabs)/more',
        children: [],
      },
    ];

    setPages(appRoutes);
  }, []);

  const navigateToPage = (path: string) => {
    router.push(path as any);
  };

  return {
    pages,
    navigateToPage,
  };
}
