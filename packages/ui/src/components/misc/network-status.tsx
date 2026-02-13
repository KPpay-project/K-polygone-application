import { WifiOff } from 'lucide-react';
import { useSyncExternalStore } from 'react';

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function NetworkStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, () => true);
  console.log(isOnline);
  if (isOnline) return null;

  return (
    <div
      className="top-0 left-0 right-0  flex items-center justify-center 
    gap-2 bg-red-600 px-4 py-2 text-sm font-medium
     text-white shadow-md animate-in slide-in-from-top duration-300"
    >
      <WifiOff className="h-4 w-4" />
      <span>You are currently offline. Please check your internet connection.</span>
    </div>
  );
}
