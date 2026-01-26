import type { NotificationModel } from "@/features/home/type";
import { Bell } from "lucide-react";
import { useState } from "react";

type NotificationMenu = {
  notifications?: NotificationModel[];
};

export default function NotificationMenu({ notifications }: NotificationMenu) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="cursor-pointer relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
      >
        <Bell className="w-6 h-6" />
        {notifications && notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifiche</h3>
          </div>
          {notifications &&
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <p className="text-sm text-gray-900">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.data}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
