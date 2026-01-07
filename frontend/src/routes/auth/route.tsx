import { MainNavigation } from '@/features/main-navigation/MainNavigation';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent
})

//TODO: la main navigation non e' ottimale per la auth, bisogna creare la AuthNavigation per migliorare il servizio e non avere dei disservizi lato UI/UX
function RouteComponent() {
  const navigate = useNavigate();
  navigate({ to: "/auth/login" });
  return <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-12">
    <MainNavigation />
    <Outlet />
  </div>
}
