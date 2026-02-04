import DashboardLayout from '@/components/layouts/dashboard-layout';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import { PasswordSecurityPage } from '@/components/modules/settings/password-security-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/settings/security')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <SettingsLayout>
        <PasswordSecurityPage />
      </SettingsLayout>
    </DashboardLayout>
  );
}
