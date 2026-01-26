import DriverLicenses from "@/features/profile/components/driver-licenses/DriverLicenses";
import NavigationTab from "@/features/profile/components/navigation/NavigationTab";
import ProfileNavigation from "@/features/profile/components/navigation/ProfileNavigation";
import PersonalData from "@/features/profile/components/personal-data/PersonalData";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import SecurityInfo from "@/features/profile/components/SecurityInfo";
import { driverLicenseApi } from "@/shared/api/driver-license.service";

import { userApi } from "@/shared/api/user.service";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  loader: loader,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const [activeSection, setActiveSection] = useState<"personali" | "patenti">(
    "personali",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader user={data.user} />
        <NavigationTab
          activeSection={activeSection}
          onActiveSection={setActiveSection}
        />
        {activeSection === "personali" && (
          <PersonalData user={data.user} address={data.addresses[0]} />
        )}
        {activeSection === "patenti" && <DriverLicenses licenses={data.driverLicense}/>}
        <SecurityInfo />
      </div>
    </div>
  );
}

async function loader() {
  const sessionUser = sessionStorage.getItem("user_data");
  if (!sessionUser) throw redirect({ to: "/home" });
  const user = JSON.parse(sessionUser);

  const sessionAddresses = await getAddresses();
  const sessionDriverLicense = await getDriverLicenses();

  return { user: user, addresses: sessionAddresses, driverLicense: sessionDriverLicense };
}


async function getAddresses() {
  const addressesStorage = sessionStorage.getItem("addresses_data");
  if (!addressesStorage) {
    const response = await userApi.get("/addresses");
    sessionStorage.setItem("addresses_data", JSON.stringify(response.data));
    return response.data;
  }
  return JSON.parse(addressesStorage);
}

async function getDriverLicenses() {
  const driverLicenseStorage = sessionStorage.getItem("driver_licenses");
  if (!driverLicenseStorage) {
    const response = await driverLicenseApi.get("/licenses");
    sessionStorage.setItem("driver_licenses", JSON.stringify(response.data));
    return response.data;
  }
  return JSON.parse(driverLicenseStorage)
}