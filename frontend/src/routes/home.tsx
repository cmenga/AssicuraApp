import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import UserNavigation from "@/features/home/components/logged/navigation/UserNavigation";
import UserDashboard from "@/features/home/UserDashboard";
import MobileUserNavigation from "@/features/home/components/logged/navigation/MobileUserNavigation";
import type { UserModel } from "@/shared/type";
import { useStoreKeyOrThrow } from "@/shared/hooks/useStoreKey";
import { routeGuard } from "@/shared/utils/guard";
import { homePageLoader } from "./loader";




export const Route = createFileRoute("/home")({
  component: RouteComponent,
  beforeLoad: () => routeGuard({ authRequired: true }),
  loader: homePageLoader,
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
