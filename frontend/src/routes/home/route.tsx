import { userApi } from "@/shared/api/user.service";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import UserNavigation from "@/features/home/components/logged/navigation/UserNavigation";
import UserDashboard from "@/features/home/UserDashboard";
import MobileUserNavigation from "@/features/home/components/logged/navigation/MobileUserNavigation";
import type { UserModel } from "@/shared/type";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  beforeLoad: isUserLogged,
  loader: loaderComponent
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState('overview');
  const data: UserModel = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-white">
      <UserNavigation
        activeTab={activeTab} onActiveTab={setActiveTab}
        avatar={data.gender == "male" ? "MR" : "MS"}
        email={data.email}
        firstName={data.first_name}
        lastName={data.last_name}
      />
      <UserDashboard activeTab={activeTab} onActiveTab={setActiveTab} />
      <MobileUserNavigation activeTab={activeTab} onActiveTab={setActiveTab} />
    </div>
  );
}


async function loaderComponent() {
  const sessionUser = sessionStorage.getItem("user_data");
  if (!sessionUser) {
    const response = await userApi.get("/me");
    sessionStorage.setItem("user_data", JSON.stringify(response.data));
    return response.data;
  }

  const user = JSON.parse(sessionUser);
  return user;
}


//TODO: bisogna fare la verifica del token per essere sicuri
async function isUserLogged() {
  const jwt_access = sessionStorage.getItem("jwt_access");
  if (!jwt_access) throw redirect({ to: "/" });
}