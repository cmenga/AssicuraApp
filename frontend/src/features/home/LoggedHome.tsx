import React, { useState } from 'react';
import {
    Car, Bike, Shield, FileText, AlertCircle, User, Settings, LogOut,
    Bell, Download, Plus, ChevronRight, Calendar, Euro, CheckCircle,
    Clock, XCircle, Search, Filter, CreditCard, Phone, Mail, MapPin,
    Edit, Trash2, Eye, MoreVertical, TrendingUp, Activity, Home
} from 'lucide-react';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const user = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@email.com',
        telefono: '+39 333 1234567',
        indirizzo: 'Via Roma, 123 - 00100 Roma (RM)',
        avatar: 'MR'
    };

    const policies = [
        {
            id: 1,
            tipo: 'Auto',
            icon: Car,
            targa: 'AB123CD',
            veicolo: 'Fiat 500 1.2',
            piano: 'RC Completa',
            stato: 'Attiva',
            scadenza: '2026-08-15',
            premio: '280.00',
            classeBonus: 1
        },
        {
            id: 2,
            tipo: 'Moto',
            icon: Bike,
            targa: 'XY789ZW',
            veicolo: 'Yamaha MT-07',
            piano: 'RC Base',
            stato: 'Attiva',
            scadenza: '2026-11-20',
            premio: '180.00',
            classeBonus: 3
        },
        {
            id: 3,
            tipo: 'Auto',
            icon: Car,
            targa: 'CD456EF',
            veicolo: 'Toyota Yaris Hybrid',
            piano: 'RC Kasko',
            stato: 'In scadenza',
            scadenza: '2026-02-10',
            premio: '450.00',
            classeBonus: 1
        }
    ];

    const claims = [
        {
            id: 1,
            numero: 'SIN-2025-001234',
            data: '2025-12-10',
            tipo: 'Collisione',
            targa: 'AB123CD',
            stato: 'In lavorazione',
            descrizione: 'Tamponamento in autostrada',
            importo: '2.500'
        },
        {
            id: 2,
            numero: 'SIN-2025-000987',
            data: '2025-10-05',
            tipo: 'Furto accessori',
            targa: 'XY789ZW',
            stato: 'Approvato',
            descrizione: 'Furto specchietto retrovisore',
            importo: '150'
        }
    ];

    const documents = [
        { id: 1, nome: 'Certificato Assicurativo AB123CD', tipo: 'PDF', data: '2025-08-15', size: '245 KB' },
        { id: 2, nome: 'Carta Verde AB123CD', tipo: 'PDF', data: '2025-08-15', size: '180 KB' },
        { id: 3, nome: 'Quietanza Pagamento 2026', tipo: 'PDF', data: '2025-08-01', size: '120 KB' },
        { id: 4, nome: 'Certificato Assicurativo XY789ZW', tipo: 'PDF', data: '2025-11-20', size: '240 KB' },
        { id: 5, nome: 'Attestato di Rischio', tipo: 'PDF', data: '2025-08-15', size: '95 KB' }
    ];

    const notifications = [
        { id: 1, messaggio: 'La polizza CD456EF scade tra 26 giorni', data: '2 ore fa', tipo: 'warning' },
        { id: 2, messaggio: 'Sinistro SIN-2025-000987 approvato', data: '1 giorno fa', tipo: 'success' },
        { id: 3, messaggio: 'Nuovo documento disponibile', data: '3 giorni fa', tipo: 'info' }
    ];

    const stats = [
        { label: 'Polizze Attive', value: '3', icon: Shield, color: 'blue', change: '+1 questo mese' },
        { label: 'Risparmio Totale', value: '€1.240', icon: TrendingUp, color: 'green', change: 'vs mercato' },
        { label: 'Sinistri Aperti', value: '1', icon: AlertCircle, color: 'orange', change: 'In lavorazione' },
        { label: 'Classe Bonus', value: '1', icon: Activity, color: 'purple', change: 'Migliore categoria' }
    ];

    const getStatusColor = (stato) => {
        const colors = {
            'Attiva': 'bg-green-100 text-green-700',
            'In scadenza': 'bg-orange-100 text-orange-700',
            'Scaduta': 'bg-red-100 text-red-700',
            'In lavorazione': 'bg-blue-100 text-blue-700',
            'Approvato': 'bg-green-100 text-green-700',
            'Rifiutato': 'bg-red-100 text-red-700'
        };
        return colors[stato] || 'bg-gray-100 text-gray-700';
    };

    const getDaysUntilExpiry = (scadenza) => {
        const today = new Date();
        const expiryDate = new Date(scadenza);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                AssicuraFacile
                            </h1>
                            <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                {['overview', 'policies', 'claims', 'documents'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
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
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white">
                            <h2 className="text-3xl font-bold mb-2">Benvenuto, {user.nome}! 👋</h2>
                            <p className="text-lg opacity-90 mb-6">Ecco un riepilogo delle tue polizze e attività recenti</p>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                                Calcola Nuovo Preventivo
                            </button>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                                        <div className={`inline-flex p-3 rounded-xl mb-4 bg-${stat.color}-100 text-${stat.color}-600`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                                        <p className="text-xs text-gray-500">{stat.change}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <Plus className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Nuova Polizza</p>
                                        <p className="text-sm text-gray-600">Calcola preventivo</p>
                                    </div>
                                </button>

                                <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition">
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                        <AlertCircle className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Apri Sinistro</p>
                                        <p className="text-sm text-gray-600">Denuncia incidente</p>
                                    </div>
                                </button>

                                <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <Download className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Scarica Documenti</p>
                                        <p className="text-sm text-gray-600">Certificati e carte</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Le Tue Polizze</h3>
                                <button
                                    onClick={() => setActiveTab('policies')}
                                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    Vedi tutte <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {policies.map((policy) => {
                                    const daysLeft = getDaysUntilExpiry(policy.scadenza);
                                    const IconComponent = policy.icon;
                                    return (
                                        <div key={policy.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="font-bold text-gray-900">{policy.veicolo}</h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.stato)}`}>
                                                                {policy.stato}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-1">Targa: {policy.targa} • {policy.piano}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Scadenza: {new Date(policy.scadenza).toLocaleDateString('it-IT')}
                                                            {daysLeft < 60 && <span className="text-orange-600 font-medium"> ({daysLeft} giorni)</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-gray-900">€{policy.premio}</p>
                                                    <p className="text-sm text-gray-500">/anno</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {claims.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Sinistri Recenti</h3>
                                    <button
                                        onClick={() => setActiveTab('claims')}
                                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        Vedi tutti <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {claims.slice(0, 2).map((claim) => (
                                        <div key={claim.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{claim.numero}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{claim.descrizione}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Targa: {claim.targa} • {new Date(claim.data).toLocaleDateString('it-IT')}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.stato)}`}>
                                                    {claim.stato}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* POLICIES TAB */}
                {activeTab === 'policies' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Le Tue Polizze</h2>
                                <p className="text-gray-600 mt-1">Gestisci tutte le tue assicurazioni</p>
                            </div>
                            <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Nuova Polizza
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {policies.map((policy) => {
                                const daysLeft = getDaysUntilExpiry(policy.scadenza);
                                const IconComponent = policy.icon;
                                return (
                                    <div key={policy.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{policy.veicolo}</h3>
                                        <p className="text-sm text-gray-600 mb-3">Targa: {policy.targa}</p>

                                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${getStatusColor(policy.stato)}`}>
                                            {policy.stato}
                                        </div>

                                        <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Piano:</span>
                                                <span className="font-medium text-gray-900">{policy.piano}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Classe Bonus:</span>
                                                <span className="font-medium text-gray-900">{policy.classeBonus}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Scadenza:</span>
                                                <span className="font-medium text-gray-900">
                                                    {new Date(policy.scadenza).toLocaleDateString('it-IT')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-gray-600">Premio annuale</span>
                                            <span className="text-2xl font-bold text-gray-900">€{policy.premio}</span>
                                        </div>

                                        {daysLeft < 60 && (
                                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                                <p className="text-xs text-orange-800 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Scade tra {daysLeft} giorni
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                                                <Eye className="w-4 h-4" />
                                                Dettagli
                                            </button>
                                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                                                <Download className="w-4 h-4" />
                                                Scarica
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CLAIMS TAB */}
                {activeTab === 'claims' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">I Tuoi Sinistri</h2>
                                <p className="text-gray-600 mt-1">Monitora lo stato delle tue pratiche</p>
                            </div>
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Apri Nuovo Sinistro
                            </button>
                        </div>

                        <div className="space-y-4">
                            {claims.map((claim) => (
                                <div key={claim.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-gray-900 text-lg">{claim.numero}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.stato)}`}>
                                                    {claim.stato}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">{claim.descrizione}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(claim.data).toLocaleDateString('it-IT')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Car className="w-4 h-4" />
                                                    {claim.targa}
                                                </span>
                                                <span className="font-medium text-gray-700">{claim.tipo}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Importo</p>
                                            <p className="text-2xl font-bold text-gray-900">€{claim.importo}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
                                            <Eye className="w-4 h-4" />
                                            Vedi Dettagli
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                                            <FileText className="w-4 h-4" />
                                            Documenti
                                        </button>
                                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                                            <Phone className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {claims.length === 0 && (
                            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun sinistro aperto</h3>
                                <p className="text-gray-600 mb-6">Ottimo! Non hai sinistri in corso</p>
                            </div>
                        )}
                    </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === 'documents' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">I Tuoi Documenti</h2>
                                <p className="text-gray-600 mt-1">Scarica certificati, carte verdi e quietanze</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                    <Search className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">Cerca</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                    <Filter className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">Filtri</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Dimensione</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Azioni</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-red-100 p-2 rounded-lg">
                                                        <FileText className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{doc.nome}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                    {doc.tipo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(doc.data).toLocaleDateString('it-IT')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{doc.size}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Documenti sempre disponibili</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Tutti i tuoi certificati assicurativi, carte verdi e quietanze sono archiviati in modo sicuro e disponibili 24/7
                                    </p>
                                    <button className="text-blue-600 font-medium text-sm hover:underline">
                                        Scopri di più sui documenti
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Navigation (Bottom Tab Bar) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${activeTab === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                            }`}
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-xs font-medium">Home</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('policies')}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${activeTab === 'policies' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                            }`}
                    >
                        <Shield className="w-6 h-6" />
                        <span className="text-xs font-medium">Polizze</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('claims')}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${activeTab === 'claims' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                            }`}
                    >
                        <AlertCircle className="w-6 h-6" />
                        <span className="text-xs font-medium">Sinistri</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${activeTab === 'documents' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                            }`}
                    >
                        <FileText className="w-6 h-6" />
                        <span className="text-xs font-medium">Docs</span>
                    </button>
                </div>
            </div>
        </div>
    );
}