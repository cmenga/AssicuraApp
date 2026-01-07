import { MainNavigation } from '@/features/main-navigation/MainNavigation';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  loader: ({ location }) => {
    if (location.pathname === "/auth") {
      throw redirect({ to: "/auth/login" });
    }
  }
});

//TODO: la main navigation non e' ottimale per la auth, bisogna creare la AuthNavigation per migliorare il servizio e non avere dei disservizi lato UI/UX
function RouteComponent() {
  return <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-12">
    <MainNavigation />
    <Outlet />
  </div>;
}
