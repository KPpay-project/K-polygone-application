import { ReactNode } from 'react';

interface DepositOptionProps {
  icon: ReactNode;
  title: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const DepositOption = ({ icon, title, description, isSelected = false, onClick }: DepositOptionProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors min-w-0 ${
        isSelected ? 'border-primary-600' : ''
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center bg-primary-800/5 flex-shrink-0">
        <div className="text-primary-600">{icon}</div>
      </div>
      <div className="text-center sm:text-left min-w-0 flex-1">
        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 sm:line-clamp-1">{description}</p>
      </div>
    </div>
  );
};
