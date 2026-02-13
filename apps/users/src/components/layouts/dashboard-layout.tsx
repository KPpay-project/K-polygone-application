import DashboardHeader from '@/components/modules/header/dashboard-header.tsx';
import { Sidebar } from '@/components/modules/sidebar';
import { useNavigate } from '@tanstack/react-router';
import { cn } from 'k-polygon-assets';
import { Menu } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import WalletUpdateListener from '@/components/listeners/wallet-update-listener';
import { useAuth } from '@/hooks/use-auth';
import { usePhoenixSocket } from '@/hooks/use-phoenix-socket';
import DefaultGlobalLoader from '../loaders/default-page-loader';

interface IDashboardLayout {
  children: React.ReactNode;
  fullContainer?: boolean;
}

const DashboardLayout: FC<IDashboardLayout> = ({ children, fullContainer }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { checkSession } = useAuth();

  useEffect(() => {
    if (checkSession()) {
      setIsChecking(false);
    } else {
      navigate({ to: '/onboarding/login', replace: true });
    }
  }, [navigate]);

  if (isChecking) {
    return <DefaultGlobalLoader />;
  }

  return (
    <div className="flex h-screen bg-[#F6F6F6]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[220px] transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex flex-1 flex-row relative">
        <div className="h-full w-full overflow-y-auto">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <div className={cn(fullContainer && 'h-[calc(100%-150px)]', 'px-3 sm:px-4 lg:px-6 my-4')}>{children}</div>
        </div>
      </main>
      <WalletUpdateListener />
      <PhoenixConnectionManager />
    </div>
  );
};

const PhoenixConnectionManager = () => {
  const { isConnected } = usePhoenixSocket();

  useEffect(() => {
    console.log('Phoenix Socket Connection Status:', isConnected ? 'Connected' : 'Disconnected');
  }, [isConnected]);

  return null;
};

export default DashboardLayout;
