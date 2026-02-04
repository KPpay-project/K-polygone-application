import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import SettingsPaymentMethod from '@/pages/dashboard/settings/payment-method';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/payment-method/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <SettingsPaymentMethod />
    </SettingsLayout>
  );
}
