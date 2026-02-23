import OverviewDashboard from "./components/OverviewDashboard";
import type { UserModel } from "@/shared/type";

type UserDashboardProps = {
  user: UserModel;
};

export default function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OverviewDashboard username={user.first_name}/>
      </div>
    </div>
  );
}
