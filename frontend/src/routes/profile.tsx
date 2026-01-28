import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";

import DriverLicenses from "@/features/profile/components/driver-licenses/DriverLicenses";
import NavigationTab from "@/features/profile/components/navigation/NavigationTab";
import ProfileNavigation from "@/features/profile/components/navigation/ProfileNavigation";
import PersonalData from "@/features/profile/components/personal-data/PersonalData";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import SecurityInfo from "@/features/profile/components/SecurityInfo";

import { useStoreKeyOrThrow } from "@/shared/hooks/useStoreKey";
import type { DriverLicenseModel, AddressModel, UserModel } from "@/shared/type";
import { storeFetch, storeFetchThrow } from "@/shared/store";
import { authApi, driverLicenseApi, userApi } from "@/shared/api/http";


export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  loader: async () => {
    const response = await authApi.post("/protected");
    if (response.status === 401) throw redirect({ to: "/auth/login" });

    await storeFetchThrow<UserModel>("user", userApi, "/me");
    await storeFetchThrow<AddressModel>("address", userApi, "/addresses");
    await storeFetch<DriverLicenseModel[]>("driver-license", driverLicenseApi, "/licenses");
  },
});

function RouteComponent() {
  const user = useStoreKeyOrThrow<UserModel>("user");
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
          <PersonalData user={user} />
        )}
        {activeSection === "patenti" && <DriverLicenses />}
        <SecurityInfo />
      </div>
    </div>
  );
}


