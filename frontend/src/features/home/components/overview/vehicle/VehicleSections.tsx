import { Car, Plus, Edit, Trash2 } from 'lucide-react';
import { useStoreKeyOrThrow } from '@/shared/hooks/useStoreKey';
import type { VehicleModel } from '@/shared/type';
import { getVehicolTypeColor } from '@/shared/utils/color';
import { getVehicleTypeIcon } from '@/shared/utils/icon';

export default function VehiclesSection() {
    const storedVehicle = useStoreKeyOrThrow<VehicleModel[]>("vehicle");



    const handleEdit = (id: string) => {
        console.log('Modifica veicolo:', id);
        // Qui aprirai un modal o form di modifica
    };

    const handleDelete = (id: string) => {
        if (confirm('Sei sicuro di voler eliminare questo veicolo?')) {
            console.log('Eliminato veicolo:', id);
        }
    };

    const handleAdd = () => {
        console.log('Aggiungi nuovo veicolo');
        // Qui aprirai un modal o form per aggiungere
    };

   

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Car className="w-6 h-6 text-blue-600" />
                    I Tuoi Veicoli
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {storedVehicle.length} {storedVehicle.length === 1 ? 'veicolo registrato' : 'veicoli registrati'}
                </p>
            </div>


            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
                {storedVehicle.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Car className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mb-4">Nessun veicolo registrato</p>
                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Aggiungi il tuo primo veicolo
                        </button>
                    </div>
                ) : (
                    storedVehicle.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group"
                        >
                            {/* Azioni in alto a destra */}
                            <div className="flex items-start justify-between mb-3">
                                <div className={`bg-linear-to-r ${getVehicolTypeColor(vehicle.type)} p-2.5 rounded-lg text-white`}>
                                    {getVehicleTypeIcon(vehicle.type)}
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(vehicle.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                        title="Modifica"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vehicle.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                        title="Elimina"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">
                                    {vehicle.brand} {vehicle.model}
                                </h4>
                                <div className="flex items-center justify-between">
                                    <span className="inline-block bg-gray-900 text-white px-3 py-1 rounded-md text-xs font-mono font-semibold">
                                        {vehicle.license_plate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>


            {storedVehicle.length < 3 && storedVehicle.length > 0 && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Aggiungi Veicolo
                    </button>
                </div>
            )}
        </div>
    );
}
