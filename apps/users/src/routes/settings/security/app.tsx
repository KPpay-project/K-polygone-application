import SetupGoogleAuthScreen from '@/components/actions/settings-actions/google-authenticator-action';
import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/security/app')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <SetupGoogleAuthScreen />
    </SettingsLayout>
  );
}
