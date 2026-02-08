import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import UserNavigation from "@/features/navigation/UserNavigation";
import UserDashboard from "@/features/home/UserDashboard";
import MobileUserNavigation from "@/features/navigation/MobileUserNavigation";
import type { UserModel } from "@/shared/type";
import { useStoreKeyOrThrow } from "@/shared/hooks/useStoreKey";
import { storeFetchThrow } from "@/shared/store";
import { authApi, userApi } from "@/shared/api/http";




export const Route = createFileRoute("/home")({
  component: RouteComponent,
  loader: async () => {
    try {
      const response = await authApi.post("/protected");
      if (response.status === 401) throw redirect({ to: "/auth/login" });

      await storeFetchThrow<UserModel>("user", userApi, "/me");
    } catch {
      throw redirect({to: "/"})
    }
  }
});

function RouteComponent() {
  const storedUser = useStoreKeyOrThrow<UserModel>("user");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="relative min-h-screen bg-white">

      <UserNavigation
        activeTab={activeTab}
        onActiveTab={setActiveTab}
        avatar={storedUser.gender == "male" ? "MR" : "MS"}
        email={storedUser.email}
        firstName={storedUser.first_name}
        lastName={storedUser.last_name}
      />
      <UserDashboard
        activeTab={activeTab}
        onActiveTab={setActiveTab}
        user={storedUser}
      />
      <MobileUserNavigation activeTab={activeTab} onActiveTab={setActiveTab} />
    </div>
  );
}
