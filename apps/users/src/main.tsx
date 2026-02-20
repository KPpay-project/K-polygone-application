import App from '@/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { Toaster } from 'sonner';
import { TourGuildProvider } from '@/providers/tour-guild-provider';

const queryClient = new QueryClient();

const SW_RELOAD_KEY = 'users-app-sw-purge-reloads';
const SW_LOG_PREFIX = '[SW-PURGE]';

const purgeServiceWorkerState = async () => {
  let changed = false;

  for (let i = 0; i < 3; i += 1) {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.info(`${SW_LOG_PREFIX} pass=${i + 1} registrations=${registrations.length}`);
      if (registrations.length > 0) {
        changed = true;
        const results = await Promise.all(registrations.map((registration) => registration.unregister()));
        console.info(`${SW_LOG_PREFIX} unregister results:`, results);
      }
    }
  }

  if ('caches' in window) {
    const keys = await caches.keys();
    console.info(`${SW_LOG_PREFIX} cache keys:`, keys);
    if (keys.length > 0) {
      changed = true;
      const deleted = await Promise.all(keys.map((key) => caches.delete(key)));
      console.info(`${SW_LOG_PREFIX} cache delete results:`, deleted);
    }
  }

  console.info(`${SW_LOG_PREFIX} changed=${changed}`);
  return changed;
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  (async () => {
    const changed = await purgeServiceWorkerState();
    const reloadCount = Number(sessionStorage.getItem(SW_RELOAD_KEY) || '0');
    console.info(`${SW_LOG_PREFIX} reloadCount=${reloadCount}`);

    if (changed && reloadCount < 2) {
      sessionStorage.setItem(SW_RELOAD_KEY, String(reloadCount + 1));
      console.info(`${SW_LOG_PREFIX} reloading page to flush stale SW/cache`);
      window.location.reload();
      return;
    }

    sessionStorage.removeItem(SW_RELOAD_KEY);
    console.info(`${SW_LOG_PREFIX} purge complete; booting app`);

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
