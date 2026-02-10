import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import IDVerificationScreen from '@/pages/dashboard/settings/verification/identity-document';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/verifications/identity-document')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <IDVerificationScreen />
    </SettingsLayout>
  );
}
