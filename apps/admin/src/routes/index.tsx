import NotFoundComponent from '@/pages/not-found';

import LoginPage from '@/pages/onboarding/login';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/')({
  component: Index,
  notFoundComponent: NotFoundComponent()
});

function Index() {
  return <LoginPage />;
}
