import App from '@/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { Toaster } from 'sonner';
import { TourGuildProvider } from '@/providers/tour-guild-provider';

const queryClient = new QueryClient();

const clearServiceWorkerAndCaches = async () => {
  let changed = false;

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length > 0) {
      changed = true;
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  }

  if ('caches' in window) {
    const keys = await caches.keys();
    if (keys.length > 0) {
      changed = true;
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  }

  return changed;
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  (async () => {
    const hasClearedCache = sessionStorage.getItem('users-app-cache-cleared') === '1';
    const changed = await clearServiceWorkerAndCaches();

    if (changed && !hasClearedCache) {
      sessionStorage.setItem('users-app-cache-cleared', '1');
      window.location.reload();
      return;
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <TourGuildProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster richColors={true} position={'top-center'} />
          </QueryClientProvider>
        </TourGuildProvider>
      </StrictMode>
    );
  })();
}
