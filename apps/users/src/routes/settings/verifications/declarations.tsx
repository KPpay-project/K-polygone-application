import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import DeclaringVerificationScreen from '@/pages/dashboard/settings/verification/declarations';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/verifications/declarations')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <DeclaringVerificationScreen />
    </SettingsLayout>
  );
}
