import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import SettingsMyProfile from '@/pages/dashboard/settings/my-profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/my-profile/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <SettingsMyProfile />
    </SettingsLayout>
  );
}
