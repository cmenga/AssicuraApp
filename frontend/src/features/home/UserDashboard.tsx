import OverviewDashboard from "./components/OverviewDashboard";
import PoliciesDashboard from "./components/PoliciesDashboard";

import type { UserModel } from "@/shared/type";

type UserDashboardProps = {
  activeTab: string;
  onActiveTab: (tab: string) => void;
  user: UserModel;
};

export default function UserDashboard({
  activeTab,
  onActiveTab,
  user,
}: UserDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <OverviewDashboard
            onActiveTab={onActiveTab}
            username={user.first_name}
          />
        )}
        {activeTab === "policies" && <PoliciesDashboard />}
      </div>
    </div>
  );
}
