import { createFileRoute } from '@tanstack/react-router';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import NotificationsPage from '@/pages/dashboard/settings/notifications';

export const Route = createFileRoute('/dashboard/settings/notifications')({
  component: () => (
    <DashboardLayout>
      <SettingsLayout>
        <NotificationsPage />
      </SettingsLayout>
    </DashboardLayout>
  )
});
