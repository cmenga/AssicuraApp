import { Car, Plus } from 'lucide-react';
import { useStoreKeyOrThrow } from '@/shared/hooks/useStoreKey';
import type { VehicleModel } from '@/shared/type';
import VehicleDetail from './VehicleDetail';
import { useRef } from 'react';
import { Modal } from '@/shared/components/Modal';
import FormVehicle from './FormVehicle';

export default function VehiclesSection() {
    const storedVehicle = useStoreKeyOrThrow<VehicleModel[]>("vehicle");
    const createModal = useRef<HTMLDialogElement | null>(null);

    function handleOpen() {
        const current = createModal.current;
        if (current) current.showModal();
    };

    function handleClose() {
        const current = createModal.current;
        if (current) current.close();
    }
    
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
                            onClick={handleOpen}
                            className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Aggiungi il tuo primo veicolo
                        </button>
                    </div>
                ) : (
                    storedVehicle.map((vehicle) => (
                        <VehicleDetail vehicle={vehicle} key={vehicle.id} />
                    ))
                )}
            </div>

            {storedVehicle.length < 3 && storedVehicle.length > 0 && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={handleOpen}
                        className="cursor-pointer flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Aggiungi Veicolo
                    </button>
                </div>
            )}
            <Modal ref={createModal}>
                <FormVehicle onClose={handleClose} />
            </Modal>
        </div>
    );
}
