import type { UserModel } from "@/shared/type";

type ProfileHeaderProps = {
  user: UserModel;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-32 h-32 text-black bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold border-4 border-white">
            {user.first_name[0]}
            {user.last_name[0]}
          </div>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold mb-2">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-lg opacity-90 mb-1">{user.email}</p>
          <p className="opacity-90">{user.phone_number}</p>
        </div>
      </div>
    </div>
  );
}
