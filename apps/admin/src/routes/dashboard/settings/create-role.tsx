import { createFileRoute } from '@tanstack/react-router';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import CreateRolePage from '@/pages/dashboard/settings/create-role';

export const Route = createFileRoute('/dashboard/settings/create-role')({
  component: () => (
    <DashboardLayout>
      <SettingsLayout>
        <CreateRolePage />
      </SettingsLayout>
    </DashboardLayout>
  )
});
