import { vehicleApi } from "@/shared/api/http";
import { Modal } from "@/shared/components/Modal";
import { store } from "@/shared/store";
import type { VehicleModel } from "@/shared/type";
import { getVehicleTypeColor } from "@/shared/utils/color";
import { getVehicleTypeIcon } from "@/shared/utils/icon";
import { AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useRef, useState, type RefObject } from "react";

type VehicleDetailProps = {
    vehicle: VehicleModel;
};

export default function VehicleDetail({ vehicle }: VehicleDetailProps) {
    const deleteModal = useRef<HTMLDialogElement | null>(null);
    const editModal = useRef<HTMLDialogElement | null>(null);

    function handleOpen(ref: RefObject<HTMLDialogElement | null>) {
        const current = ref.current;
        if (current) current.showModal();
    };
    function handleClose(ref: RefObject<HTMLDialogElement | null>) {
        const current = ref.current;
        if (current) current.close();
    }
    return (
        <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group">
            {/* Azioni in alto a destra */}
            <div className="flex items-start justify-between mb-3">
                <div className={`bg-linear-to-r ${getVehicleTypeColor(vehicle.type)} p-2.5 rounded-lg text-white`}>
                    {getVehicleTypeIcon(vehicle.type)}
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => handleOpen(editModal)}
                        className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                        title="Modifica"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleOpen(deleteModal)}
                        className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                        title="Elimina"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <Modal ref={deleteModal}>
                <DeleteModal onClose={() => handleClose(deleteModal)} vehicleId={vehicle.id} />
            </Modal>
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
    );
}

type ModalProps = {
    onClose: () => void;
};

type DeleteModalProps = { vehicleId: string; } & ModalProps;

function DeleteModal({ onClose, vehicleId }: DeleteModalProps) {
    const [isLoaidng, setIsLoading] = useState(false);

    async function handleDelete() {
        setIsLoading(true);
        await vehicleApi.delete(`/delete/${vehicleId}`);
        store.dispatch<VehicleModel[]>("vehicle", (prev) => {
            if (!prev) return [];
            return prev?.filter(vehicle => vehicle.id !== vehicleId);
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        onClose();
        setIsLoading(false);
    }
    return (
        <>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">

                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                </div>


                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Conferma Cancellazione
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Sei sicuro di voler cancellare il veicolo?
                    <br />
                    <span className="text-sm text-red-600 font-medium">Questa azione non può essere annullata.</span>
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="cursor-pointer flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                        Chiudi
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoaidng}
                        className="cursor-pointer flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        {isLoaidng ? "Cancellazione..." : "Cancella"}
                    </button>
                </div>
            </div>
        </>
    );
}