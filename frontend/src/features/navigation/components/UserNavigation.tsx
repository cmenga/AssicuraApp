import ProfileMenu from "./ProfileMenu";

type UserNavigationProps = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
};

export default function UserNavigation(props: UserNavigationProps) {
  const { avatar, email, firstName, lastName } = props;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-default">
              AssicuraFacile
            </h1>
          </div>

          <div className="flex items-center gap-4">
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
