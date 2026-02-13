import ResetPassword from '@/pages/onboarding/reset-password';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const resetPasswordSearchSchema = z.object({
  token: z.string().catch('')
});

export const Route = createFileRoute('/onboarding/reset-password')({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  component: RouteComponent
});

function RouteComponent() {
  const { token } = Route.useSearch();
  return <ResetPassword token={token} />;
}
