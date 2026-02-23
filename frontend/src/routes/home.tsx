import { createFileRoute, redirect } from "@tanstack/react-router";

import UserNavigation from "@/features/navigation/components/UserNavigation";
import UserDashboard from "@/features/home/UserDashboard";
import type { UserModel, VehicleModel } from "@/shared/type";
import { useStoreKeyOrThrow } from "@/shared/hooks/useStoreKey";
import { storeFetchThrow } from "@/shared/store";
import { userApi, vehicleApi } from "@/shared/api/http";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) throw redirect({ to: "/auth/login" });

    try {
      await storeFetchThrow<UserModel>("user", userApi, "/me");
      await storeFetchThrow<VehicleModel[]>("vehicle", vehicleApi, "/vehicles");
    } catch {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const storedUser = useStoreKeyOrThrow<UserModel>("user");

  return (
    <div className="relative min-h-screen bg-white">
      <UserNavigation
        avatar={storedUser.gender == "male" ? "MR" : "MS"}
        email={storedUser.email}
        firstName={storedUser.first_name}
        lastName={storedUser.last_name}
      />
      <UserDashboard
        user={storedUser}
      />

    </div>
  );
}
