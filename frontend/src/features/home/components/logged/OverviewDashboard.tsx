import { AlertCircle, Bike, Car, ChevronRight, Download, Plus, Shield, TrendingUp, Activity } from "lucide-react";


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

const stats = [
    { label: 'Polizze Attive', value: '3', icon: Shield, color: 'blue', change: '+1 questo mese' },
    { label: 'Risparmio Totale', value: '€1.240', icon: TrendingUp, color: 'green', change: 'vs mercato' },
    { label: 'Sinistri Aperti', value: '1', icon: AlertCircle, color: 'orange', change: 'In lavorazione' },
    { label: 'Classe Bonus', value: '1', icon: Activity, color: 'purple', change: 'Migliore categoria' }
];

type OverviewDashboardProps = {
    userName: string;
    onActiveTab: (tab: string) => void;
};

const getDaysUntilExpiry = (scadenza: any) => {
    const today = new Date();
    const expiryDate = new Date(scadenza);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const getStatusColor = (stato: string) => {
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

export default function OverviewDashboard(props: OverviewDashboardProps) {

    return (
        <div className="space-y-8">
            <div className="bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Benvenuto, {props.userName}! 👋</h2>
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
                        onClick={() => props.onActiveTab('policies')}
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
                            onClick={() => props.onActiveTab('claims')}
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
    );
}