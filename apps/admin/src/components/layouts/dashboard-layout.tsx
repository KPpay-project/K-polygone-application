import DashboardHeader from '@/components/modules/header/dashboard-header.tsx';
import { Sidebar } from '@/components/modules/sidebar';
import { cn } from 'k-polygon-assets';
import { Menu } from 'lucide-react';
import { FC, useState } from 'react';
interface IDashboardLayout {
  children: React.ReactNode;
  fullContainer?: boolean;
}

const DashboardLayout: FC<IDashboardLayout> = ({ children, fullContainer }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="h-full w-full  overflow-y-auto">
          <div className="lg:hidden p-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <DashboardHeader />
          <div className={cn(fullContainer && 'h-[calc(100%-170px)]', 'px-2 sm:px-6 lg:px-8 my-6 mb-20')}>
            {children}
          </div>
        </div>
        {/* <Footer sticky /> */}
      </main>
    </div>
  );
};

export default DashboardLayout;
