import RegisterMerchantPage from '@/pages/onboarding/merchant/register-merchant';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/register-merchant')({
  component: RouteComponent
});

function RouteComponent() {
  return <RegisterMerchantPage />;
}
