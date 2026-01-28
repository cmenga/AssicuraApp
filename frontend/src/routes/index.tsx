import { createFileRoute, redirect } from "@tanstack/react-router";
import NotLoggedHome from "@/features/home/NotLoggedHome";
import { authApi } from "@/shared/api/http";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    const response = await authApi.post("/protected")
    if (response.status !== 401) throw redirect({to: "/home"})
  }
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <NotLoggedHome />
    </div>
  );
}


