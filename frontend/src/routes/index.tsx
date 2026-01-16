import { createFileRoute } from "@tanstack/react-router";
import NotLoggedHome from "@/features/home/NotLoggedHome";

export const Route = createFileRoute("/")({
  component: RouteComponent
});

function RouteComponent() {
  return <div className="min-h-screen bg-white">
    <NotLoggedHome />
  </div>;
}
