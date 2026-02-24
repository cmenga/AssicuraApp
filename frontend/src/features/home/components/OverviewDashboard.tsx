import QuickActions from "./QuickActions";
import HeaderOverview from "./HeaderOverview";
import VehiclesSection from "./vehicle/VehicleSections";
import Policies from "./Policies";


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
