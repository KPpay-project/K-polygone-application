import Login from '@/pages/onboarding/login';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/login')({
  component: RouteComponent
});

function RouteComponent() {
  return <Login />;
}
