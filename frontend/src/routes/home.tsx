import { userApi } from "@/shared/api/user.service";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import UserNavigation from "@/features/home/components/logged/navigation/UserNavigation";
import UserDashboard from "@/features/home/UserDashboard";
import MobileUserNavigation from "@/features/home/components/logged/navigation/MobileUserNavigation";
import type { UserModel } from "@/shared/type";
import { driverLicenseApi } from "@/shared/api/driver-license.service";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  beforeLoad: isUserLogged,
  loader: loader,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("overview");
  const data: { user: UserModel, driverLicense?: undefined | any; } = Route.useLoaderData();
  console.log(data.driverLicense)
  return (
    <div className="min-h-screen bg-white">
      <UserNavigation
        activeTab={activeTab}
        onActiveTab={setActiveTab}
        avatar={data.user.gender == "male" ? "MR" : "MS"}
        email={data.user.email}
        firstName={data.user.first_name}
        lastName={data.user.last_name}
      />
      <UserDashboard
        activeTab={activeTab}
        onActiveTab={setActiveTab}
        user={data.user}
      />
      <MobileUserNavigation activeTab={activeTab} onActiveTab={setActiveTab} />
    </div>
  );
}

async function loader() {
  const user: UserModel = await getUserData();
  const driverLicense = await addDriverLicense(user.date_of_birth);

  return { user: user, driverLicense: driverLicense };
}

//TODO: bisogna fare la verifica del token per essere sicuri
async function isUserLogged() {
  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) throw redirect({ to: "/" });

}


async function getUserData() {
  const sessionUser = sessionStorage.getItem("user_data");
  if (!sessionUser) {
    const response = await userApi.get("/me");
    sessionStorage.setItem("user_data", JSON.stringify(response.data));
    return response.data;
  }
  const user = JSON.parse(sessionUser);
  return user;
}


async function addDriverLicense(date_of_birth: string) {
  const sessionDriverLicense = localStorage.getItem("license_dto");
  console.log(sessionDriverLicense)
  if (sessionDriverLicense) {
    const data = JSON.parse(sessionDriverLicense);

    const response = driverLicenseApi.post("/add", {
      license_code: data.license_category,
      license_number: data.license_number,
      issue_date: data.license_issue_date,
      expiry_date: data.license_expiry_date,
      date_of_birth: date_of_birth
    });
    localStorage.removeItem("license_dto");
    return (await response).data ;
  }
  return undefined
}