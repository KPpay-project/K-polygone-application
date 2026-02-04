'use client';

import React, { useState } from 'react';
import { Button } from 'k-polygon-assets/components';
import { Typography } from '@/components/sub-modules/typography/typography';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Monitor, Smartphone, MoreVertical, LogOut, MapPin, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  signInMethod: string;
  lastActive: string;
  isCurrent: boolean;
}

interface DeviceSessionsTableProps {
  sessions?: DeviceSession[];
  onLogoutDevice?: (deviceId: string) => Promise<void>;
  className?: string;
}

const mockSessions: DeviceSession[] = [
  {
    id: '1',
    deviceName: 'Chrome Windows',
    deviceType: 'desktop',
    location: 'Cameroon',
    signInMethod: 'Web',
    lastActive: '10 minutes ago, today',
    isCurrent: true
  },
  {
    id: '2',
    deviceName: 'iPhone',
    deviceType: 'mobile',
    location: 'Cameroon',
    signInMethod: 'Mobile app (ios)',
    lastActive: '2 hours ago',
    isCurrent: false
  }
];

export const DeviceSessionsTable = ({
  sessions = mockSessions,
  onLogoutDevice,
  className
}: DeviceSessionsTableProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLogout = async (deviceId: string, deviceName: string) => {
    try {
      setIsLoading(deviceId);

      if (onLogoutDevice) {
        await onLogoutDevice(deviceId);
      } else {
        // Mock API call for demo
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast.success(`Logged out of ${deviceName} successfully`);
    } catch {
      toast.error('Failed to logout device. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-4 w-4 text-gray-600" />;
      case 'desktop':
        return <Monitor className="h-4 w-4 text-gray-600" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <Typography variant="h3" className="text-gray-900 mb-2">
          Devices & Sessions
        </Typography>
        <Typography variant="muted" className="text-gray-600">
          Active sessions. You are currently logged into these device(s).
        </Typography>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-2 bg-gray-100 rounded-lg">{getDeviceIcon(session.deviceType)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Typography variant="p" className="font-medium text-gray-900">
                      {session.deviceName}
                    </Typography>
                    {session.isCurrent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{session.signInMethod}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{session.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!session.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogout(session.id, session.deviceName)}
                    disabled={isLoading === session.id}
                    className="text-red-600 border-red-200 hover:bg-red-50 hidden sm:flex"
                  >
                    {isLoading === session.id ? 'Logging out...' : 'Logout of this device'}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!session.isCurrent && (
                      <DropdownMenuItem
                        onClick={() => handleLogout(session.id, session.deviceName)}
                        disabled={isLoading === session.id}
                        className="text-red-600 focus:text-red-600"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {isLoading === session.id ? 'Logging out...' : 'Logout of this device'}
                      </DropdownMenuItem>
                    )}
                    {session.isCurrent && (
                      <DropdownMenuItem disabled className="text-gray-400">
                        <LogOut className="h-4 w-4 mr-2" />
                        Current session
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-8">
          <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Typography variant="p" className="text-gray-600">
            No active sessions found
          </Typography>
        </div>
      )}
    </div>
  );
};
