import OTPPage from '@/pages/onboarding/otp';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const otpSearchSchema = z.object({
  email: z.string().optional().catch('')
});

export const Route = createFileRoute('/onboarding/otp')({
  validateSearch: (search) => otpSearchSchema.parse(search),
  component: RouteComponent
});

function RouteComponent() {
  const { email } = Route.useSearch();
  return <OTPPage />;
}
