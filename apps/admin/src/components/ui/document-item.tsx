import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './button';

interface DocumentItemProps {
  name: string;
  icon: string;
  size?: string;
  onDelete?: () => void;
  className?: string;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ name, icon, size, onDelete, className = '' }) => {
  return (
    <div
      className={`border border-gray-300 rounded-[10px] p-[10px_10px_10px_16px] w-[420px] flex justify-between items-center gap-[10px] ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-[30px] h-[30px] overflow-hidden">
          {icon ? (
            <img src={icon} alt="file icon" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div className="flex flex-col justify-center gap-[2px]">
          <span className="text-base font-medium leading-[24px] tracking-[0.64px] text-gray-900">{name}</span>
          {size && (
            <div className="flex items-center gap-[6px]">
              <span className="text-xs text-gray-500">{size}</span>
            </div>
          )}
        </div>
      </div>
      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          className="p-3 h-auto border-gray-100 bg-white hover:bg-gray-50 shadow-sm"
          onClick={onDelete}
        >
          <Trash2 className="h-[18px] w-[18px] text-gray-600" />
        </Button>
      )}
    </div>
  );
};

export default DocumentItem;
