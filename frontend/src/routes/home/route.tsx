import UserDashboard from "@/features/home/LoggedHome";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <UserDashboard />
    </div>
  );
}
