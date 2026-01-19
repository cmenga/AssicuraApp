import { createFileRoute, redirect } from "@tanstack/react-router";
import NotLoggedHome from "@/features/home/NotLoggedHome";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: beforeLoad,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <NotLoggedHome />
    </div>
  );
}

function beforeLoad() {
  const accessToken = sessionStorage.getItem("access_token");
  if (accessToken) throw redirect({ to: "/home" });
}
