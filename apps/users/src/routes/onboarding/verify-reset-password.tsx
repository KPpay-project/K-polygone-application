import VerifyResetPassword from '@/pages/onboarding/verify-password-reset';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const verifyResetSearchSchema = z.object({
  email: z.string().catch('')
});

export const Route = createFileRoute('/onboarding/verify-reset-password')({
  validateSearch: (search) => verifyResetSearchSchema.parse(search),
  component: RouteComponent
});

function RouteComponent() {
  const { email } = Route.useSearch();
  return <VerifyResetPassword email={email} />;
}
