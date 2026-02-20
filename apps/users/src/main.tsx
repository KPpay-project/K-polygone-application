import App from '@/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { Toaster } from 'sonner';
import { TourGuildProvider } from '@/providers/tour-guild-provider';
import { registerSW } from 'virtual:pwa-register';

const queryClient = new QueryClient();

const LEGACY_SW_CLEANUP_KEY = 'users-app-legacy-sw-cleanup-v1';

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

const cleanupLegacyServiceWorkersOnce = async () => {
  if (!('serviceWorker' in navigator) || localStorage.getItem(LEGACY_SW_CLEANUP_KEY) === 'done') return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const legacyRegistrations = registrations.filter((registration) => {
      const scriptUrl = registration.active?.scriptURL || registration.waiting?.scriptURL || registration.installing?.scriptURL || '';
      return !scriptUrl.endsWith('/sw.js');
    });

    if (legacyRegistrations.length > 0) {
      console.info(`[PWA] Unregistering ${legacyRegistrations.length} legacy service worker(s).`);
      await Promise.all(legacyRegistrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      const legacyCacheKeys = cacheKeys.filter((key) => !key.startsWith('workbox-') && !key.includes('precache'));
      if (legacyCacheKeys.length > 0) {
        console.info(`[PWA] Removing ${legacyCacheKeys.length} legacy cache storages.`);
        await Promise.all(legacyCacheKeys.map((key) => caches.delete(key)));
      }
    }
  } catch (error) {
    console.warn('[PWA] Legacy cleanup failed:', error);
  } finally {
    localStorage.setItem(LEGACY_SW_CLEANUP_KEY, 'done');
  }
};

const setupPwa = async () => {
  if (!('serviceWorker' in navigator)) return;

  await cleanupLegacyServiceWorkersOnce();

  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      console.info('[PWA] Service worker registered:', swUrl);

      if (!registration) return;

      const checkForUpdate = () => registration.update().catch((error) => console.warn('[PWA] Update check failed:', error));
      setInterval(checkForUpdate, 60_000);
      window.addEventListener('online', checkForUpdate);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
    },
    onNeedRefresh() {
      console.info('[PWA] New build available. Activating update now.');
      void updateSW(true);
    },
    onOfflineReady() {
      console.info('[PWA] App is ready for offline use.');
    },
    onRegisterError(error) {
      console.error('[PWA] Registration error:', error);
    }
  });
};

renderApp();
void setupPwa();
