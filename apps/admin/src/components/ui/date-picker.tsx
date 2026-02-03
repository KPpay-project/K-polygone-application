import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(currentMonth.getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatInputDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    onChange(formatInputDate(date));
    setIsOpen(false);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentYear, month, 1);
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    const newDate = new Date(year, currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
  };

  const yearOptions = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i);

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    onChange(formatInputDate(today));
    setIsOpen(false);
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2.5 text-left',
          'bg-white border border-gray-200 rounded-lg shadow-sm',
          'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
          'transition-all duration-200 ease-in-out',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200',
          isOpen && 'border-blue-500 ring-2 ring-blue-500/20'
        )}
      >
        <span className={cn('text-sm', selectedDate ? 'text-gray-900' : 'text-gray-500')}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 bg-white/95 backdrop-blur-sm border border-gray-100/50 rounded-2xl shadow-2xl z-50 w-80 overflow-hidden">
          {/* Calendar Header with Dropdowns */}
          <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 border-b border-gray-50">
            {/* Month Dropdown */}
            <div className="relative">
              <select
                value={currentMonth.getMonth()}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <select
                value={currentYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="px-6 py-4">
            {/* Day names */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {dayNames.map((day) => (
                <div key={day} className="text-xs font-medium text-gray-400 text-center py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={index} className="aspect-square">
                  {date && (
                    <button
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      className={cn(
                        'w-full h-full flex items-center justify-center text-sm rounded-2xl transition-all duration-300 ease-out',
                        'hover:bg-blue-50/70 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200/60',
                        isSelected(date) &&
                          'bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold shadow-xl scale-110 ring-2 ring-blue-200/50',
                        isToday(date) &&
                          !isSelected(date) &&
                          'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 font-medium ring-1 ring-blue-200/40',
                        !isSelected(date) && !isToday(date) && 'text-gray-600 hover:text-blue-500'
                      )}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50/20 via-indigo-50/20 to-purple-50/20 border-t border-gray-50">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-blue-400 hover:text-blue-500 font-medium transition-all duration-300 hover:scale-105 px-3 py-1 rounded-full hover:bg-blue-50/50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
