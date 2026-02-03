import React, { useState, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Typography } from '../typography/typography';
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  CloseCircle,
} from 'iconsax-react-nativejs';

export interface DateSelectorProps {
  label?: string;
  value?: string;
  onDateSelect: (date: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  fullDate: Date;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  label,
  value,
  onDateSelect,
  placeholder = 'Select date',
  error,
  disabled = false,
  className = '',
  minDate,
  maxDate,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const selectedDate = useMemo(
    () => (value ? parseDate(value) : null),
    [value]
  );

  const getDaysInMonth = useMemo((): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];
    const today = new Date();

    // Add previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        fullDate: dayDate,
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const isToday =
        dayDate.getDate() === today.getDate() &&
        dayDate.getMonth() === today.getMonth() &&
        dayDate.getFullYear() === today.getFullYear();
      const isSelected =
        selectedDate &&
        dayDate.getDate() === selectedDate.getDate() &&
        dayDate.getMonth() === selectedDate.getMonth() &&
        dayDate.getFullYear() === selectedDate.getFullYear();

      days.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        isSelected: !!isSelected,
        fullDate: dayDate,
      });
    }

    // Add next month's leading days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const dayDate = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        fullDate: dayDate,
      });
    }

    return days;
  }, [currentMonth, selectedDate]);

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateSelect = useCallback(
    (day: CalendarDay) => {
      if (!day.isCurrentMonth || isDateDisabled(day.fullDate)) return;

      const formattedDate = formatDate(day.fullDate);
      onDateSelect(formattedDate);
      setIsCalendarOpen(false);
    },
    [onDateSelect, minDate, maxDate]
  );

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  }, []);

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
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth;

  const displayValue = useMemo(
    () => (selectedDate ? formatDate(selectedDate) : ''),
    [selectedDate]
  );

  return (
    <View className={`relative ${className}`}>
      {label && (
        <Typography variant="body" className="text-gray-900 font-medium mb-3">
          {label}
        </Typography>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setIsCalendarOpen(true)}
        activeOpacity={0.7}
        className={`bg-white rounded-xl border ${
          error ? 'border-red-500' : 'border-gray-200'
        } flex-row items-center justify-between p-4 ${
          disabled ? 'opacity-50' : ''
        }`}
        disabled={disabled}
      >
        <Typography
          variant="body"
          className={displayValue ? 'text-gray-900' : 'text-gray-400'}
        >
          {displayValue || placeholder}
        </Typography>
        <Calendar size={20} color="#6B7280" />
      </TouchableOpacity>

      {error && (
        <Typography variant="caption" className="text-red-500 mt-1">
          {error}
        </Typography>
      )}

      {/* Calendar Modal */}
      <Modal
        visible={isCalendarOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCalendarOpen(false)}
      >
        <View
          className="flex-1 bg-black/50 justify-center px-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <View className="bg-white rounded-2xl p-6 relative">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setIsCalendarOpen(false)}
              activeOpacity={0.7}
              className="absolute top-4 right-4 z-10"
            >
              <CloseCircle size={32} color="#EF4444" />
            </TouchableOpacity>

            {/* Calendar Header */}
            <View className="flex-row items-center justify-between mb-6 mt-8">
              <TouchableOpacity
                onPress={() => navigateMonth('prev')}
                activeOpacity={0.7}
                className="p-2"
              >
                <ArrowLeft size={20} color="#374151" />
              </TouchableOpacity>

              <Typography variant="h4" className="text-gray-900 font-semibold">
                {monthNames[currentMonth.getMonth()]}{' '}
                {currentMonth.getFullYear()}
              </Typography>

              <TouchableOpacity
                onPress={() => navigateMonth('next')}
                activeOpacity={0.7}
                className="p-2"
              >
                <ArrowRight size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Week Days Header */}
            <View className="flex-row mb-2">
              {weekDays.map((day) => (
                <View key={day} className="flex-1 items-center py-2">
                  <Typography
                    variant="caption"
                    className="text-gray-500 font-medium"
                  >
                    {day}
                  </Typography>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View>
              {Array.from({ length: 6 }, (_, weekIndex) => (
                <View key={weekIndex} className="flex-row">
                  {days
                    .slice(weekIndex * 7, (weekIndex + 1) * 7)
                    .map((day, dayIndex) => {
                      const isDisabled =
                        !day.isCurrentMonth || isDateDisabled(day.fullDate);

                      return (
                        <TouchableOpacity
                          key={`${weekIndex}-${dayIndex}`}
                          onPress={() => handleDateSelect(day)}
                          disabled={isDisabled}
                          activeOpacity={0.7}
                          className={`flex-1 items-center py-3 mx-1 rounded-lg ${
                            day.isSelected
                              ? 'bg-red-500'
                              : day.isToday && day.isCurrentMonth
                                ? 'bg-red-100'
                                : ''
                          }`}
                        >
                          <Typography
                            variant="body"
                            className={`${
                              day.isSelected
                                ? 'text-white font-semibold'
                                : day.isToday && day.isCurrentMonth
                                  ? 'text-red-500 font-semibold'
                                  : day.isCurrentMonth
                                    ? isDisabled
                                      ? 'text-gray-300'
                                      : 'text-gray-900'
                                    : 'text-gray-300'
                            }`}
                          >
                            {day.date}
                          </Typography>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
