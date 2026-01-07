import { AuthNavigation } from '@/features/navigation/AuthNavigation';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  loader: ({ location }) => {
    if (location.pathname === "/auth") {
      throw redirect({ to: "/auth/login" });
    }
  }
});


function RouteComponent() {
  return <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-12">
    <AuthNavigation />
    <Outlet />
  </div>;
}
