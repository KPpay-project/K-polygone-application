import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import PersonalInfoScreen from '@/pages/dashboard/settings/verification/personal-info';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/verifications/personal-information')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <PersonalInfoScreen />
    </SettingsLayout>
  );
}
