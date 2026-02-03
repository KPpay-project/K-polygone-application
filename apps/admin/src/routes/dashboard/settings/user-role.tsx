import { createFileRoute } from '@tanstack/react-router';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import UserRolePage from '@/pages/dashboard/settings/user-role';

export const Route = createFileRoute('/dashboard/settings/user-role')({
  component: () => (
    <DashboardLayout>
      <SettingsLayout>
        <UserRolePage />
      </SettingsLayout>
    </DashboardLayout>
  )
});
