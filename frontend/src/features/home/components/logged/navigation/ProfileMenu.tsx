import { LogOut, Settings, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

type ShowProfileMenuProps = {
    firstName: string
    lastName: string
    email: string
    avatar: string
}

export default function ProfileMenu(props: ShowProfileMenuProps) {
    const {firstName,lastName, email, avatar } = props; 
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3"
            >
                <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900">{firstName} {lastName}</p>
                    <p className="text-xs text-gray-500">{email}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {avatar}
                </div>
            </button>

            {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <Link to="/profile" className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profilo</span>
                    </Link>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Impostazioni</span>
                    </button>
                    <hr className="my-2" />
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Esci</span>
                    </button>
                </div>
            )}
        </div>
    );
}