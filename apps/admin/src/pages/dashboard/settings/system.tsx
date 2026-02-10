'use client';

import React, { useState } from 'react';
import { Typography } from '@/components/sub-modules/typography/typography';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

interface SystemSettings {
  defaultCurrency: string;
  dateFormat: string;
}

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    defaultCurrency: 'XOF',
    dateFormat: 'DD/MM/YYYY'
  });

  const [hasChanges, setHasChanges] = useState(false);

  const currencies = [
    { value: 'XOF', label: 'XOF', flag: '🇸🇳' },
    { value: 'USD', label: 'USD', flag: '🇺🇸' },
    { value: 'EUR', label: 'EUR', flag: '🇪🇺' },
    { value: 'GBP', label: 'GBP', flag: '🇬🇧' },
    { value: 'NGN', label: 'NGN', flag: '🇳🇬' },
    { value: 'GHS', label: 'GHS', flag: '🇬🇭' },
    { value: 'ZMW', label: 'ZMW', flag: '🇿🇲' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
    { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const handleCurrencyChange = (value: string) => {
    setSettings((prev) => ({ ...prev, defaultCurrency: value }));
    setHasChanges(true);
  };

  const handleDateFormatChange = (value: string) => {
    setSettings((prev) => ({ ...prev, dateFormat: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Here you would typically save to your backend/API
    console.log('Saving settings:', settings);
    setHasChanges(false);
    // You could add a toast notification here
  };

  const handleDiscardChanges = () => {
    // Reset to original values or fetch from API
    setSettings({
      defaultCurrency: 'XOF',
      dateFormat: 'DD/MM/YYYY'
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Typography variant="h2" className="text-2xl font-semibold text-gray-900 mb-2">
          System Settings
        </Typography>
        <Typography variant="p" className="text-gray-600">
          Configure system-wide settings for your application.
        </Typography>
      </div>

      {/* Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Currency */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Typography variant="p" className="text-sm font-medium text-gray-900">
              Default currency
            </Typography>
          </div>
          <Select value={settings.defaultCurrency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full h-12 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <SelectValue placeholder="Select currency" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  <div className="flex items-center gap-2">
                    <span>{currency.flag}</span>
                    <span>{currency.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Format */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Typography variant="p" className="text-sm font-medium text-gray-900">
              Date Format
            </Typography>
          </div>
          <Select value={settings.dateFormat} onValueChange={handleDateFormatChange}>
            <SelectTrigger className="w-full h-12 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              {dateFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-6">
        <Button
          variant="outline"
          onClick={handleDiscardChanges}
          disabled={!hasChanges}
          className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Discard changes
        </Button>
        <Button
          onClick={handleSaveChanges}
          disabled={!hasChanges}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
