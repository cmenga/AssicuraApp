import { createFileRoute } from "@tanstack/react-router";
import NotLoggedHome from "@/features/home/NotLoggedHome";
import { routeGuard } from "@/shared/utils/guard";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: () => routeGuard({ guestOnly: true, redirectTo: "/home" }),
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <NotLoggedHome />
    </div>
  );
}


