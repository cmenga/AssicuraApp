import UserDashboard from "@/features/home/UserDashboard";
import { createFileRoute, redirect} from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  beforeLoad: () => {
    const jwt_access = sessionStorage.getItem("jwt_access")
    if(!jwt_access) throw redirect({to:"/"})
  }
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <UserDashboard />
    </div>
  );
}
