import { useState, useEffectEvent } from "react";
import { createPortal } from "react-dom";


interface NotificationModel {
    message: string;
    type: "error" | "success";
}
export function useNotification(duration = 3000): [React.FC, (notification: NotificationModel) => void] {
    const [notification, setNotification] = useState<NotificationModel | null>(null); // { message, type }

    // Funzione per chiudere la notifica automaticamente
    const hideNotification = useEffectEvent(() => {
        setTimeout(() => setNotification(null), duration);
    });

    // Funzione per mostrare una notifica
    const showNotification = useEffectEvent((notification: NotificationModel) => {
        setNotification(notification);
        hideNotification();
    });

    // Componente che renderizza la notifica
    const NotificationComponent: React.FC = () => {
        if (!notification) return null;
        
        const { message, type } = notification;
        const bgColor =
            type === "success"
                ? "bg-green-500"
                : type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500";
        return createPortal(
            <div className={`fixed z-50 bottom-2 right-4 px-4 py-2 min-w-md rounded shadow text-white ${bgColor} transition-opacity duration-300`}>
                {message}
            </div>,
            document.body
        );
    };

    return [NotificationComponent, showNotification];
}
