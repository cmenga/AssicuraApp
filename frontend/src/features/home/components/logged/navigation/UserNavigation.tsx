import type { NavigationProps, NotificationModel } from "@/features/home/type";
import ProfileMenu from "./ProfileMenu";
import NotificationMenu from "./NotificatinoMenu";

type UserNavigationProps = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  notifications?: NotificationModel[];
} & NavigationProps;

export default function UserNavigation(props: UserNavigationProps) {
  const { activeTab, onActiveTab, avatar, email, firstName, lastName } = props;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-default">
              AssicuraFacile
            </h1>
            <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {["overview", "policies", "claims", "documents"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => onActiveTab(tab)}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab === "overview" && "Dashboard"}
                  {tab === "policies" && "Polizze"}
                  {tab === "claims" && "Sinistri"}
                  {tab === "documents" && "Documenti"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationMenu />
            <ProfileMenu
              avatar={avatar}
              email={email}
              firstName={firstName}
              lastName={lastName}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
