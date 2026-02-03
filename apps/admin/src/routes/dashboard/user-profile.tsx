import { createFileRoute } from '@tanstack/react-router';
import UserProfilePage from '@/pages/dashboard/user-profile';

export const Route = createFileRoute('/dashboard/user-profile')({
  component: UserProfilePage
});
