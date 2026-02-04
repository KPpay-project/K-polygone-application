import React from 'react';
import { SettingsSidebar } from '@/components/modules/settings/settings-sidebar';
import { useSettingsMenuItems } from '@/components/modules/settings/settings-menu';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const menuItems = useSettingsMenuItems();

  return (
    <div className="flex gap-3 lg:gap-6">
      {/* Settings Sidebar - Responsive Width */}
      <div className="w-16 lg:w-64 flex-shrink-0">
        <SettingsSidebar items={menuItems} />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-10 backdrop-blur-sm bg-white/95 lg:h-[calc(100vh-70px-56px-48px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-gray-100">
          {/* Dynamic Content Area */}
          {children}
        </div>
      </div>
    </div>
  );
};
