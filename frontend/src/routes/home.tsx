import { userApi } from "@/shared/api/user.service";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import UserNavigation from "@/features/home/components/logged/navigation/UserNavigation";
import UserDashboard from "@/features/home/UserDashboard";
import MobileUserNavigation from "@/features/home/components/logged/navigation/MobileUserNavigation";
import type { UserModel } from "@/shared/type";
import { driverLicenseApi } from "@/shared/api/driver-license.service";
import { useNotification } from "@/shared/hooks/useNotification";
import { store } from "@/shared/model/store";
import { useStoreKey } from "@/shared/hooks/useStoreKey";



export const Route = createFileRoute("/home")({
  component: RouteComponent,
  beforeLoad: isUserLogged,
  loader: loader,
});


async function isUserLogged() {
  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) throw redirect({ to: "/" });
}

function RouteComponent() {
  const storedUser = useStoreKey<UserModel>("user");
  if (!storedUser) throw new Error("Utente non trovato");

  const [activeTab, setActiveTab] = useState("overview");
  const [Notify, setNotify] = useNotification();
  const data: { response?: undefined | any; } = Route.useLoaderData();
  const status = data.response?.status ?? null;

  useEffect(() => {
    if (!status) return;
    const showNotify = async () => {
      if (status !== 204) {
        setNotify({ message: "La patente inserita non risulta veritiera", type: "error" });
      } else {
        setNotify({ message: "La patente è stata salvata con successo", type: "success" });
      }
    };

    showNotify();

  }, [status, setNotify]);


  return (
    <div className="relative min-h-screen bg-white">
      <Notify />
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



async function loader() {
  await getUserData();
  const user = store.get<UserModel>("user");

  if (user) {
    const response = await addDriverLicense(user.date_of_birth);
    return { response };
  }

}

async function getUserData() {
  const user = store.get("user");
  if (user) return;

  const response = await userApi.get("/me");
  switch (response.status) {
    case 404:
      throw new Error("Utente non trovato");
  }
  const fetchedUser = response.data;
  store.set<UserModel>("user", fetchedUser);
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