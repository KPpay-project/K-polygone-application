import GetStarted from '@/pages/onboarding/get-started';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/get-started')({
  component: RouteComponent
});

function RouteComponent() {
  return <GetStarted />;
}
