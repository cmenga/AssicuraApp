import { userApi } from "@/shared/api/user.service";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import UserNavigation from "@/features/home/components/logged/navigation/UserNavigation";
import UserDashboard from "@/features/home/UserDashboard";
import MobileUserNavigation from "@/features/home/components/logged/navigation/MobileUserNavigation";
import type { UserModel } from "@/shared/type";
import { driverLicenseApi } from "@/shared/api/driver-license.service";
import { useNotification } from "@/shared/hooks/useNotification";


export const Route = createFileRoute("/home")({
  component: RouteComponent,
  beforeLoad: isUserLogged,
  loader: loader,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [Notify, setNotify] = useNotification();
  const data: { user: UserModel, response?: undefined | any; } = Route.useLoaderData();
  const status = data.response?.status;

  useEffect(() => {
    async function showNotify() {
      if (status != 204) {
        setNotify({ message: "La patente inserita in fase di registrazione non risulta veritiera", type: "error" });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
      if (status == 204) {
        setNotify({ message: "La patente è stata salvata con successo", type: "success" });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    if (status) showNotify();
  }, [status]);

  return (
    <div className="relative min-h-screen bg-white">
      <Notify />
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
  const response = await addDriverLicense(user.date_of_birth);

  return { user: user, response: response };
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
    return await response;
  }
  return undefined;
}