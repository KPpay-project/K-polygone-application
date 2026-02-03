import PasswordReset from '@/pages/onboarding/password-reset';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/password-reset')({
  component: RouteComponent
});

function RouteComponent() {
  return <PasswordReset />;
}
