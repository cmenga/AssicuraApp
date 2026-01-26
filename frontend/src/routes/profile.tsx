import DriverLicenses from "@/features/profile/components/driver-licenses/DriverLicenses";
import NavigationTab from "@/features/profile/components/navigation/NavigationTab";
import ProfileNavigation from "@/features/profile/components/navigation/ProfileNavigation";
import PersonalData from "@/features/profile/components/personal-data/PersonalData";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import SecurityInfo from "@/features/profile/components/SecurityInfo";
import { driverLicenseApi } from "@/shared/api/driver-license.service";

import { userApi } from "@/shared/api/user.service";
import { useStoreKey } from "@/shared/hooks/useStoreKey";
import { store } from "@/shared/model/store";
import type { AddressModel, DriverLicenseModel, UserModel } from "@/shared/type";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  loader: loader,
});

function RouteComponent() {
  const user = useStoreKey<UserModel>("user");
  const address = useStoreKey<AddressModel>("address");
  const driverLicense = useStoreKey<DriverLicenseModel[]>("driver-license");
  if (!user) throw new Error("Utente non trovato");
  if (!address) throw new Error("Indirizzo non trovato");


  const [activeSection, setActiveSection] = useState<"personali" | "patenti">(
    "personali",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader user={user} />
        <NavigationTab
          activeSection={activeSection}
          onActiveSection={setActiveSection}
        />
        {activeSection === "personali" && (
          <PersonalData user={user} address={address} />
        )}
        {activeSection === "patenti" && <DriverLicenses licenses={driverLicense} />}
        <SecurityInfo />
      </div>
    </div>
  );
}


async function loader() {
  await getUser();
  await getAddresses();
  await getDriverLicenses();
}

async function getUser() {
  const user = store.get("user");
  if (user) return;

  const response = await userApi.get("/me");
  if (response.status == 404) {
    throw new Error("Utente non trovato");
  }
  const fetchedUser = await response.data;
  store.set<UserModel>("user", fetchedUser);
}

async function getAddresses() {
  const address = store.get("address")
  if (address) return;

  const response = await userApi.get("/addresses");
  switch (response.status) {
    case 404:
      throw new Error("Nessun indirizzo è stato trovato per l'utente");

  }
  const fetchedAddresses = await response.data()
  store.set<AddressModel>("address", fetchedAddresses[0])
}

async function getDriverLicenses() {
  const driverLicense = store.get("driver-license")
  if (driverLicense) return

  const response = await driverLicenseApi.get("/licenses");
  switch (response.status) {
    case 404:
      return [];
  }
  const fetchedDriverLicenses = await response.data;
  store.set<DriverLicenseModel[]>("driver-license",fetchedDriverLicenses)
}