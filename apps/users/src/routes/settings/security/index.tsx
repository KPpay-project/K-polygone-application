import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import SettingsSecurity from '@/pages/dashboard/settings/security';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/security/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <SettingsSecurity />
    </SettingsLayout>
  );
}
