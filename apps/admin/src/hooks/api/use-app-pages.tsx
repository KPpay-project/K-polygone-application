/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useState } from 'react';
//@ts-ignores
import routes from '~react-pages';

type RouteType = {
  caseSensitive: boolean;
  path: string;
  element: ReactNode;
  children: RouteType[];
};

export function useAppPages() {
  const [pages, setPages] = useState<RouteType[]>(routes);

  useEffect(() => {
    setPages(routes || []);
  }, [routes]);

  return { pages: pages || [] };
}
