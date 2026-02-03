import DashboardHeader from '@/components/modules/header/dashboard-header.tsx';
import { Sidebar } from '@/components/modules/sidebar';
import { JWT_TOKEN_NAME } from '@/constant';
import { useNavigate } from '@tanstack/react-router';
import { cn } from 'k-polygon-assets';
import { Menu } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface IDashboardLayout {
  children: React.ReactNode;
  fullContainer?: boolean;
}

const MerchantDashboardLayout: FC<IDashboardLayout> = ({ children, fullContainer }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  useEffect(() => {
    const token = getCookie(JWT_TOKEN_NAME);

    if (!token) {
      navigate({ to: '/onboarding/login' });
      return;
    }

    setIsChecking(false);
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F6F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F6F6F6]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar />
        </div>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex flex-1 flex-row relative ">
        <div className="h-full w-full overflow-y-auto">
          <div className="lg:hidden p-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <DashboardHeader />

          <div className={cn(fullContainer && 'h-[calc(100%-170px)]', 'px-2 sm:px-6 lg:px-8 my-6')}>{children}</div>
        </div>
      </main>
    </div>
  );
};

export default MerchantDashboardLayout;
