import ResetPassword from '@/pages/onboarding/reset-password';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const resetPasswordSearchSchema = z.object({
  email: z.string().catch(''),
  otpCode: z.string().catch('')
});

export const Route = createFileRoute('/onboarding/reset-password')({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  component: RouteComponent
});

function RouteComponent() {
  const { email, otpCode } = Route.useSearch();
  return <ResetPassword email={email} otpCode={otpCode} />;
}
