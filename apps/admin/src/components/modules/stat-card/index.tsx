import React, { ReactNode } from 'react';

type ColorScheme = 'blue' | 'green' | 'red' | 'yellow';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorScheme: ColorScheme;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    text: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-500',
    text: 'text-green-600'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-500',
    text: 'text-red-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-500',
    text: 'text-yellow-600'
  }
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorScheme }) => {
  const colors = colorMap[colorScheme];

  return (
    <div className={`${colors.bg} p-4 rounded-lg`}>
      <div className="flex items-center mb-2">
        <div className={`${colors.iconBg} p-2 rounded-lg`}>{icon}</div>
      </div>
      <div className={`text-sm ${colors.text}`}>{title}</div>
      <div className={`text-xl font-semibold ${colors.text}`}>{value}</div>
    </div>
  );
};
