import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomSelector, { Option } from '@/components/ui/custom-selector';
import DatePicker from '@/components/ui/date-picker';

interface FilterModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

export interface FilterValues {
  dateFrom?: string;
  dateTo?: string;
  role?: string;
  status?: string;
}

const roleOptions: Option[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'country_manager', label: 'Country Manager' },
  { value: 'regional_admin', label: 'Regional Admin' },
  { value: 'support_staff', label: 'Support Staff' }
];

const statusOptions: Option[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active', color: 'text-green-600' },
  { value: 'inactive', label: 'Inactive', color: 'text-yellow-600' },
  { value: 'suspended', label: 'Suspended', color: 'text-red-600' }
];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onOpenChange, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState<FilterValues>(currentFilters);

  const handleReset = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      role: 'all',
      status: 'all'
    };
    setFilters(resetFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const hasActiveFilters = () => {
    return (
      (filters.dateFrom && filters.dateFrom !== '') ||
      (filters.dateTo && filters.dateTo !== '') ||
      (filters.role && filters.role !== 'all') ||
      (filters.status && filters.status !== 'all')
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-5">
        <DialogHeader className="px-6 py-4 border-b p-5">
          <div className="flex items-center justify-between ">
            <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            ></Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          {/* Date Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">Date Range</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({ ...filters, dateFrom: '', dateTo: '' });
                }}
                className="text-xs text-blue-600 hover:text-blue-800 h-auto p-0"
              >
                Reset
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">From</label>
                <DatePicker
                  value={filters.dateFrom || ''}
                  onChange={(dateString: string) => {
                    setFilters({ ...filters, dateFrom: dateString });
                  }}
                  placeholder="Select start date"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">To</label>
                <DatePicker
                  value={filters.dateTo || ''}
                  onChange={(dateString: string) => {
                    setFilters({ ...filters, dateTo: dateString });
                  }}
                  placeholder="Select end date"
                />
              </div>
            </div>
          </div>

          {/* Role Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">Role</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ ...filters, role: 'all' })}
                className="text-xs text-blue-600 hover:text-blue-800 h-auto p-0"
              >
                Reset
              </Button>
            </div>
            <CustomSelector
              options={roleOptions}
              value={filters.role || 'all'}
              onValueChange={(value: string) => setFilters({ ...filters, role: value })}
              placeholder="Select role"
              isDropDownPopup={false}
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">Status</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ ...filters, status: 'all' })}
                className="text-xs text-blue-600 hover:text-blue-800 h-auto p-0"
              >
                Reset
              </Button>
            </div>
            <CustomSelector
              options={statusOptions}
              value={filters.status || 'all'}
              onValueChange={(value: string) => setFilters({ ...filters, status: value })}
              placeholder="Select status"
              isDropDownPopup={false}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4  flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 h-10 px-4 py-2"
            disabled={!hasActiveFilters()}
          >
            Reset all
          </Button>
          <Button onClick={handleApply} className="flex-1 h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
            Apply now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
