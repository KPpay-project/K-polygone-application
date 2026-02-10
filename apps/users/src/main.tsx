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

registerSW({ immediate: true });

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
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
}
