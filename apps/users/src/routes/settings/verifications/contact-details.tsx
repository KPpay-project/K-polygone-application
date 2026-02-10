import SettingsLayout from '@/components/layouts/dashboard/settings-layout';
import ContactVerificationScreen from '@/pages/dashboard/settings/verification/contact';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/verifications/contact-details')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SettingsLayout>
      <ContactVerificationScreen />
    </SettingsLayout>
  );
}
