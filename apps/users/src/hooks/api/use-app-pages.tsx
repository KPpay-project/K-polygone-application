import { ReactNode, useEffect, useState } from 'react';
import { routeTree } from '@/routeTree.gen';

type RouteType = {
  caseSensitive: boolean;
  path: string;
  element: ReactNode;
  children: RouteType[];
};

export function useAppPages() {
  const [pages, setPages] = useState<RouteType[]>([]);

  useEffect(() => {
    // Convert routeTree to the expected format
    const convertRouteTree = (route: any): RouteType[] => {
      if (!route) return [];

      const routes: RouteType[] = [];
      if (route.path) {
        routes.push({
          caseSensitive: route.caseSensitive || false,
          path: route.path,
          element: route.component,
          children: route.children ? route.children.flatMap(convertRouteTree) : []
        });
      }
      return routes;
    };

    setPages(convertRouteTree(routeTree));
  }, []);

  return { pages };
}
