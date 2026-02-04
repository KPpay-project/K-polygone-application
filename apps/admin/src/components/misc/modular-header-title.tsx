import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import ModularFilterModal, { FilterConfig } from '@/components/common/modular-filter-modal';

interface ModularHeaderTitleProps {
  title: string;
  count?: number;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  showSearch?: boolean;
  showFilter?: boolean;
  currentFilters?: Record<string, any>;
  filterConfig?: FilterConfig;
  children?: React.ReactNode;
}

const ModularHeaderTitle: React.FC<ModularHeaderTitleProps> = ({
  title,
  count,
  onSearch,
  onFilter,
  showSearch = true,
  showFilter = true,
  currentFilters = {},
  filterConfig,
  children
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleApplyFilters = (filters: Record<string, any>) => {
    if (onFilter) {
      onFilter(filters);
    }
  };

  const hasActiveFilters = () => {
    if (!filterConfig) return false;

    return filterConfig.fields.some((field) => {
      const value = currentFilters[field.key];
      if (field.type === 'date-range') {
        return (
          (currentFilters[`${field.key}From`] && currentFilters[`${field.key}From`] !== '') ||
          (currentFilters[`${field.key}To`] && currentFilters[`${field.key}To`] !== '')
        );
      }
      return value && value !== 'all' && value !== '';
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {count !== undefined && (
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{count}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showSearch && onSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}

        {showFilter && onFilter && filterConfig && (
          <>
            <Button
              variant="outline"
              className="flex items-center gap-2 relative"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filter
              {hasActiveFilters() && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />}
            </Button>

            <ModularFilterModal
              isOpen={isFilterModalOpen}
              onOpenChange={setIsFilterModalOpen}
              onApplyFilters={handleApplyFilters}
              currentFilters={currentFilters}
              config={filterConfig}
            />
          </>
        )}

        {children}
      </div>
    </div>
  );
};

export default ModularHeaderTitle;
