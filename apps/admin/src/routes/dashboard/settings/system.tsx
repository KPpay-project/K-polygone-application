import { createFileRoute } from '@tanstack/react-router';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import SystemSettingsPage from '@/pages/dashboard/settings/system';

export const Route = createFileRoute('/dashboard/settings/system')({
  component: () => (
    <DashboardLayout>
      <SettingsLayout>
        <SystemSettingsPage />
      </SettingsLayout>
    </DashboardLayout>
  )
});
