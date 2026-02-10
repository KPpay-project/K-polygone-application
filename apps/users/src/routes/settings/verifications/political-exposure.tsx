import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import PoliticalExposureVerificationScreen from '@/pages/dashboard/settings/verification/political-exposure';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/verifications/political-exposure')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <PoliticalExposureVerificationScreen />
    </SettingsLayout>
  );
}
