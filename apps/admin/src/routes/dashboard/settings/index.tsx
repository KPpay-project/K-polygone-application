import DashboardLayout from '@/components/layouts/dashboard-layout';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import { SettingsPage } from '@/components/modules/settings/settings-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/settings/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <SettingsLayout>
        <SettingsPage />
      </SettingsLayout>
    </DashboardLayout>
  );
}
