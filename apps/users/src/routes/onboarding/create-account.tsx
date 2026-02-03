import CreateAccount from '@/pages/onboarding/create-account';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/create-account')({
  component: RouteComponent
});

function RouteComponent() {
  return <CreateAccount />;
}
