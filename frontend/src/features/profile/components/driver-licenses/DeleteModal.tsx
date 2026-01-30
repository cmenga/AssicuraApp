import { driverLicenseApi } from "@/shared/api/http";
import { ErrorMessage } from "@/shared/components/form/FormMessage";
import { Modal } from "@/shared/components/Modal";
import { store } from "@/shared/store";
import type { DriverLicenseModel } from "@/shared/type";
import { Trash2, X } from "lucide-react";
import { useState, type RefObject } from "react";


export default function DeleteModal({ ref, id }: { ref: RefObject<HTMLDialogElement | null>, id: string; }) {
    const [errors, setErrors] = useState<Record<string, string> | undefined>(undefined);

    function handleClose() {
        if (ref.current)
            ref.current.close();
    }
    async function handleDelete() {
        const response = await driverLicenseApi.delete(`/delete/${id}`);
        switch (response.status) {
            case 404:
                setErrors({ detail: "Patente non trovate" });
                return;
        }
        store.dispatch<DriverLicenseModel[]>("driver-license", (prev) => {
            if (prev) {
                return prev.filter(element => element.id !== id);
            }
            return [];
        });
        handleClose();
    }

    return (
        <Modal ref={ref}>
            <div className="p-6 max-w-xl space-y-6">
                <header>
                    <h1 className="text-2xl text-gray-800">Sicuro di voler elminire la patente?</h1>
                </header>
                {errors?.detail && <ErrorMessage message={errors.detail} />}
                <footer className="flex gap-6">
                    <button
                        onClick={handleClose}
                        type="reset"
                        className="cursor-pointer flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-gray-100 to-gray-200 text-balck py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <X className="h-5 w-5" />
                        Chiudi
                    </button>
                    <button
                        onClick={handleDelete}
                        type="submit"
                        className="cursor-pointer flex items-center justify-center gap-2 flex-1 bg-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <Trash2 className="w-5 h-5" />
                        Cancella
                    </button>
                </footer>
            </div>
        </Modal>
    );
}