import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  title?: React.ReactNode;
  showSearch?: boolean;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
  onFilterClick?: () => void;
  showExport?: boolean;
  onExport?: () => void;
  className?: string;
  children?: React.ReactNode;
};

const HeaderWithSearch: React.FC<Props> = ({
  title = 'Recent transaction',
  showSearch = true,
  onSearch,
  searchPlaceholder = 'Search by transactions...',
  showFilters = true,
  onFilterClick,
  showExport = true,
  onExport,
  className,
  children
}) => {
  const [value, setValue] = useState('');

  const handleChange = (v: string) => {
    setValue(v);
    onSearch?.(v);
  };

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div>{title && <h3 className="text-lg font-medium text-gray-600">{title}</h3>}</div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              aria-label="Search transactions"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10 pr-4 py-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-[250px]"
            />
          </div>
        )}

        {showFilters && (
          <Button
            variant="outline"
            className=" border-[1px] text-gray-500 border-gray-500 bg-transparent flex items-center gap-2 px-4 py-2"
            onClick={onFilterClick}
            aria-label="Open filters"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        )}

        {showExport && (
          <Button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 border-0"
            onClick={onExport}
            aria-label="Export transactions"
          >
            Export
          </Button>
        )}

        {children}
      </div>
    </div>
  );
};

export default HeaderWithSearch;
