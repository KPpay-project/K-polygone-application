import NotFoundComponent from '@/pages/not-found';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen relative bg-gray-50">
      <Outlet />
    </div>
  ),
  notFoundComponent: NotFoundComponent('/dashboard/')
});
