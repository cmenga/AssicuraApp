import { userApi } from "@/shared/api/user.service";
import UserDashboard from "@/features/home/UserDashboard";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { UserNavigation } from "@/features/home/components/logged/UserNavigation";
import { MobileUserNavigation } from "@/features/home/components/logged/MobileUserNavigation";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  beforeLoad: isUserLogged,
  loader: loaderComponent
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState('overview');
  const data = Route.useLoaderData();
  console.log(data);

  return (
    <div className="min-h-screen bg-white">
      <UserNavigation activeTab={activeTab} onActiveTab={setActiveTab} />
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