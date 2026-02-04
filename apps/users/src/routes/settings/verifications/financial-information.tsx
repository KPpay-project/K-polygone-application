import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import FinancialInfoVerification from '@/pages/dashboard/settings/verification/financial-info';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/verifications/financial-information')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <FinancialInfoVerification />
    </SettingsLayout>
  );
}
