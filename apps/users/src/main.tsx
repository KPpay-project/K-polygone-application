import App from '@/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { Toaster } from 'sonner';
import { TourGuildProvider } from '@/providers/tour-guild-provider';

const queryClient = new QueryClient();

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement || rootElement.innerHTML) return;

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
};

const cleanupServiceWorkers = async () => {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length > 0) {
      console.info(`[PWA] Unregistering ${registrations.length} service worker(s).`);
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      if (cacheKeys.length > 0) {
        console.info(`[PWA] Removing ${cacheKeys.length} cache storage bucket(s).`);
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }
    }
  } catch (error) {
    console.warn('[PWA] Service worker cleanup failed:', error);
  }
};

renderApp();
void cleanupServiceWorkers();
