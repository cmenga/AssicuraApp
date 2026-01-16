import { Calendar, Car, CheckCircle, Eye, FileText, Phone, Plus } from "lucide-react";

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

export function ClaimsDashboard() {

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">I Tuoi Sinistri</h2>
                    <p className="text-gray-600 mt-1">Monitora lo stato delle tue pratiche</p>
                </div>
                <button className="bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
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
    );
}