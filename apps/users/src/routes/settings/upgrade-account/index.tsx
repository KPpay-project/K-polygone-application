import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import SettingsUpgradeAccount from '@/pages/dashboard/settings/upgrade-account';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/upgrade-account/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <SettingsUpgradeAccount />
    </SettingsLayout>
  );
}
