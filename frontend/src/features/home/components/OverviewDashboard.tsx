import QuickActions from "./overview/QuickActions";
import HeaderOverview from "./overview/HeaderOverview";
import VehiclesSection from "./overview/vehicle/VehicleSections";
import Policies from "./overview/Policies";


type OverviewDashboardProps = {
  username: string;
};

export default function OverviewDashboard({
  username
}: OverviewDashboardProps) {
  return (
    <div className="space-y-8">
      <HeaderOverview username={username} />
      <div className="grid md:grid-cols-2 gap-6">
        <QuickActions />
        <VehiclesSection />
      </div>
      <Policies />
    </div>
  );
}
