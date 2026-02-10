import ForgotPassword from '@/pages/onboarding/forgot-password';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/forgot-password')({
  component: RouteComponent
});

function RouteComponent() {
  return <ForgotPassword />;
}
