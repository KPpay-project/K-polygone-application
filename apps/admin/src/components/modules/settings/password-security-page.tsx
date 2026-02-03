import React from 'react';
import { SettingsCard } from '@/components/modules/settings/settings-card';
import { PasswordResetForm } from '@/components/modules/settings/password-reset-form';
import { TwoFactorAuth } from '@/components/modules/settings/two-factor-auth';
import { DeviceSessionsTable } from '@/components/modules/settings/device-sessions-table';

export const PasswordSecurityPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Password Reset Section */}
      <div>
        <SettingsCard title="Password Reset" description="Change your password at any time" className="p-6">
          <PasswordResetForm />
        </SettingsCard>
      </div>

      {/* Two-Factor Authentication Section */}
      <div>
        <SettingsCard
          title="2-Factor Authentication"
          description="Choose how you want to receive your authentication codes"
          className="p-6"
        >
          <TwoFactorAuth />
        </SettingsCard>
      </div>

      {/* Devices & Sessions Section */}
      <div>
        <SettingsCard
          title="Devices & sessions"
          description="Active sessions. You are currently logged into these device(s)."
          className="p-6"
        >
          <DeviceSessionsTable />
        </SettingsCard>
      </div>
    </div>
  );
};
