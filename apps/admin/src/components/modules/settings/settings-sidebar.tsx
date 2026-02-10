'use client';

import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/sub-modules/typography/typography';
import { SettingsMenuItemProps } from './settings-menu';

interface SettingsSidebarProps {
  items: SettingsMenuItemProps[];
  className?: string;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ items, className }) => {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  return (
    <div
      className={cn(
        'w-16 lg:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6',
        'h-[calc(100vh-70px-56px-48px)]', // Full height minus header (70px) + footer (56px) + margins/padding (48px)
        'backdrop-blur-sm bg-white/95',
        className
      )}
    >
      <div className="mb-8 hidden lg:block">
        <Typography variant="h3" className="text-gray-900 font-semibold text-lg">
          Settings
        </Typography>
        <Typography variant="muted" className="text-gray-500 mt-1 text-sm">
          You can find all your settings here
        </Typography>
      </div>

      <nav className="space-y-2">
        {items.map((item, index) => {
          const isActive = pathname === item.href || item.active;

          return (
            <Link
              key={index}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-2 lg:px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                'hover:bg-gray-50/80 hover:shadow-sm hover:translate-x-1',
                'group relative overflow-hidden',
                'justify-center lg:justify-start',
                isActive
                  ? 'bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50 translate-x-1'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              title={item.label} // Add tooltip for small screens
            >
              <span
                className={cn(
                  'flex-shrink-0 transition-colors duration-200',
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                )}
              >
                {item.icon}
              </span>
              <span className="truncate font-medium hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
