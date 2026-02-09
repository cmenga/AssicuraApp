import QuickActions from "./overview/QuickActions";
import HeaderOverview from "./overview/HeaderOverview";
import Stats from "./overview/Stats";
import Policies from "./overview/Policies";

type OverviewDashboardProps = {
  username: string;
  onActiveTab: (tab: string) => void;
};

export default function OverviewDashboard({
  username,
  onActiveTab,
}: OverviewDashboardProps) {
  return (
    <div className="space-y-8">
      <HeaderOverview username={username} />
      <div className="grid md:grid-cols-2 gap-6">
        <QuickActions />
        <Stats />
      </div>
      <Policies onActiveTab={onActiveTab} />
    </div>
  );
}
