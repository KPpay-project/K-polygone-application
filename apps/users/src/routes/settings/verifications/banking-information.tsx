import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import BankingInfoVerificationScreen from '@/pages/dashboard/settings/verification/banking-info';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/verifications/banking-information')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <BankingInfoVerificationScreen />
    </SettingsLayout>
  );
}
