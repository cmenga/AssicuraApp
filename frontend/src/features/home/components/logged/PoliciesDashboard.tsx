import { AlertCircle, Bike, Car, Download, Eye, MoreVertical, Plus } from "lucide-react";

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

const getDaysUntilExpiry = (scadenza) => {
    const today = new Date();
    const expiryDate = new Date(scadenza);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

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

export default function PoliciesDashboard() {

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Le Tue Polizze</h2>
                    <p className="text-gray-600 mt-1">Gestisci tutte le tue assicurazioni</p>
                </div>
                <button className="bg-linear-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
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
    );
}