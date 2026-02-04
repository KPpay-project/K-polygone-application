import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomSelector, { Option } from '@/components/ui/custom-selector';
import DatePicker from '@/components/ui/date-picker';

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'date-range';
  options?: Option[];
  placeholder?: string;
}

export interface FilterConfig {
  fields: FilterField[];
  defaultValues: Record<string, any>;
}

interface ModularFilterModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: Record<string, any>) => void;
  currentFilters: Record<string, any>;
  config: FilterConfig;
}

const ModularFilterModal: React.FC<ModularFilterModalProps> = ({
  isOpen,
  onOpenChange,
  onApplyFilters,
  currentFilters,
  config
}) => {
  const [filters, setFilters] = useState<Record<string, any>>(currentFilters);

  const handleReset = () => {
    setFilters(config.defaultValues);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const hasActiveFilters = () => {
    return config.fields.some((field) => {
      const value = filters[field.key];
      if (field.type === 'date-range') {
        return (
          (filters[`${field.key}From`] && filters[`${field.key}From`] !== '') ||
          (filters[`${field.key}To`] && filters[`${field.key}To`] !== '')
        );
      }
      return value && value !== 'all' && value !== '';
    });
  };

  const resetField = (field: FilterField) => {
    if (field.type === 'date-range') {
      setFilters({
        ...filters,
        [`${field.key}From`]: '',
        [`${field.key}To`]: ''
      });
    } else {
      setFilters({
        ...filters,
        [field.key]: config.defaultValues[field.key] || 'all'
      });
    }
  };

  const renderField = (field: FilterField) => {
    if (field.type === 'date-range') {
      return (
        <div key={field.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">{field.label}</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetField(field)}
              className="text-xs text-blue-600 hover:text-blue-800 h-auto p-0"
            >
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">From</label>
              <DatePicker
                value={filters[`${field.key}From`] || ''}
                onChange={(dateString: string) => {
                  setFilters({ ...filters, [`${field.key}From`]: dateString });
                }}
                placeholder="Select start date"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">To</label>
              <DatePicker
                value={filters[`${field.key}To`] || ''}
                onChange={(dateString: string) => {
                  setFilters({ ...filters, [`${field.key}To`]: dateString });
                }}
                placeholder="Select end date"
              />
            </div>
          </div>
        </div>
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">{field.label}</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetField(field)}
              className="text-xs text-blue-600 hover:text-blue-800 h-auto p-0"
            >
              Reset
            </Button>
          </div>
          <CustomSelector
            options={field.options}
            value={filters[field.key] || 'all'}
            onValueChange={(value: string) => setFilters({ ...filters, [field.key]: value })}
            placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
            isDropDownPopup={false}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-5">
        <DialogHeader className="px-6 py-4 border-b p-5">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            ></Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">{config.fields.map((field) => renderField(field))}</div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3">
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

export default ModularFilterModal;
