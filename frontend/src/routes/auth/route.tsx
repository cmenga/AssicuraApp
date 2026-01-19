import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import Footer from "@/shared/components/Footer";
import AuthNavigation from "@/features/auth/components/AuthNavigation";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  loader: ({ location }) => {
    if (location.pathname === "/auth") {
      throw redirect({ to: "/auth/login" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50">
      <AuthNavigation />
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
