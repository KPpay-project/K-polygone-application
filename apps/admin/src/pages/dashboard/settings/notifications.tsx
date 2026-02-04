'use client';

import React, { useState } from 'react';
import { Typography } from '@/components/sub-modules/typography/typography';
import { Switch } from '@/components/ui/switch';

interface NotificationSettings {
  email: boolean;
  pushNotification: boolean;
  sms: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  settings: NotificationSettings;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationCategory[]>([
    {
      id: 'login-alerts',
      title: 'Login Alerts',
      description: 'Notifications on successful logins to your account',
      settings: {
        email: true,
        pushNotification: true,
        sms: true
      }
    },
    {
      id: 'transaction-alert',
      title: 'Transaction Alert',
      description: 'Notifications on transaction activities and updates',
      settings: {
        email: true,
        pushNotification: false,
        sms: false
      }
    },
    {
      id: 'price-alert',
      title: 'Price Alert',
      description: 'Notifications on price changes and market updates',
      settings: {
        email: true,
        pushNotification: false,
        sms: false
      }
    },
    {
      id: 'new-signup-alert',
      title: 'New Sign up Alert',
      description: 'Notifications on new user registrations',
      settings: {
        email: true,
        pushNotification: false,
        sms: false
      }
    },
    {
      id: 'dispute',
      title: 'Dispute',
      description: 'Notifications on dispute cases and resolutions',
      settings: {
        email: true,
        pushNotification: false,
        sms: false
      }
    }
  ]);

  const handleToggle = (categoryId: string, settingType: keyof NotificationSettings, checked: boolean) => {
    setNotifications((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              settings: {
                ...category.settings,
                [settingType]: checked
              }
            }
          : category
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Typography variant="h2" className="text-2xl font-semibold text-gray-900 mb-2">
          Notifications
        </Typography>
        <Typography variant="p" className="text-gray-600">
          Manage your notification preferences for different types of activities.
        </Typography>
      </div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {notifications.map((category) => (
          <div key={category.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="mb-4">
              <Typography variant="h3" className="text-lg font-medium text-gray-900 mb-1">
                {category.title}
              </Typography>
              <Typography variant="p" className="text-sm text-gray-600">
                {category.description}
              </Typography>
            </div>

            <div className="flex flex-wrap gap-6">
              {/* Email Toggle */}
              <div className="flex items-center gap-3">
                <Typography variant="p" className="text-sm font-medium text-gray-700 min-w-[50px]">
                  Email
                </Typography>
                <Switch
                  checked={category.settings.email}
                  onCheckedChange={(checked) => handleToggle(category.id, 'email', checked)}
                />
              </div>

              {/* Push Notification Toggle */}
              <div className="flex items-center gap-3">
                <Typography variant="p" className="text-sm font-medium text-gray-700 min-w-[120px]">
                  Push Notification
                </Typography>
                <Switch
                  checked={category.settings.pushNotification}
                  onCheckedChange={(checked) => handleToggle(category.id, 'pushNotification', checked)}
                />
              </div>

              {/* SMS Toggle */}
              <div className="flex items-center gap-3">
                <Typography variant="p" className="text-sm font-medium text-gray-700 min-w-[35px]">
                  SMS
                </Typography>
                <Switch
                  checked={category.settings.sms}
                  onCheckedChange={(checked) => handleToggle(category.id, 'sms', checked)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
