import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import IndexVerificationScreen from '@/pages/dashboard/settings/verification';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/verifications/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <IndexVerificationScreen />
    </SettingsLayout>
  );
}
