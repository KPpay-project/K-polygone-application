import './i18n';
import './styles/app.css';

import { ApolloProvider } from '@apollo/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';
import { apolloClient } from './lib/apollo-client';

import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-white/70 backdrop-blur-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <RouterProvider router={router} defaultPendingComponent={GlobalLoader} defaultPendingMinMs={250} />
      </ApolloProvider>
    </HelmetProvider>
  );
}

export default App;
