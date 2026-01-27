import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import DriverLicenses from "@/features/profile/components/driver-licenses/DriverLicenses";
import NavigationTab from "@/features/profile/components/navigation/NavigationTab";
import ProfileNavigation from "@/features/profile/components/navigation/ProfileNavigation";
import PersonalData from "@/features/profile/components/personal-data/PersonalData";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import SecurityInfo from "@/features/profile/components/SecurityInfo";

import { routeGuard } from "@/shared/utils/guard";
import { useStoreKeyOrThrow } from "@/shared/hooks/useStoreKey";
import { profaliPageLoader } from "./loader";
import type { UserModel } from "@/shared/type";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: () => routeGuard({ authRequired: true }),
  loader: profaliPageLoader,
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


