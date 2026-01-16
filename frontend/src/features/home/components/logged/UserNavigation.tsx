import { Bell, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import type { UserNavigationProps } from "../../type";

const user = {
    nome: 'Mario',
    cognome: 'Rossi',
    email: 'mario.rossi@email.com',
    telefono: '+39 333 1234567',
    indirizzo: 'Via Roma, 123 - 00100 Roma (RM)',
    avatar: 'MR'
};

const notifications = [
    { id: 1, messaggio: 'La polizza CD456EF scade tra 26 giorni', data: '2 ore fa', tipo: 'warning' },
    { id: 2, messaggio: 'Sinistro SIN-2025-000987 approvato', data: '1 giorno fa', tipo: 'success' },
    { id: 3, messaggio: 'Nuovo documento disponibile', data: '3 giorni fa', tipo: 'info' }
];



export function UserNavigation(props: UserNavigationProps) {
    const {activeTab,onActiveTab} = props
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            AssicuraFacile
                        </h1>
                        <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            {['overview', 'policies', 'claims', 'documents'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => onActiveTab(tab)}
                                    className={`px-4 py-2 rounded-md font-medium transition ${activeTab === tab
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {tab === 'overview' && 'Dashboard'}
                                    {tab === 'policies' && 'Polizze'}
                                    {tab === 'claims' && 'Sinistri'}
                                    {tab === 'documents' && 'Documenti'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                            >
                                <Bell className="w-6 h-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-semibold text-gray-900">Notifiche</h3>
                                    </div>
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                            <p className="text-sm text-gray-900">{notif.messaggio}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notif.data}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3"
                            >
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-gray-900">{user.nome} {user.cognome}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user.avatar}
                                </div>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm">Profilo</span>
                                    </button>
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
                    </div>
                </div>
            </div>
        </nav>

    );
}


