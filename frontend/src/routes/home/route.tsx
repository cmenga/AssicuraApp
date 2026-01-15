import { NotLoggedHome } from "@/features/home/NotLoggedHome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <NotLoggedHome />
    </div>
  );
}
