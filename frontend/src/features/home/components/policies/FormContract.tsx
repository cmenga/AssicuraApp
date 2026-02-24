import { useStoreKey } from "@/shared/hooks/useStoreKey";
import type { ActionResponse, VehicleModel } from "@/shared/type";
import FormVehicle from "../vehicle/FormVehicle";
import ChoiceVehicle from "../vehicle/ChoiceVehicle";
import { useRef, useState } from "react";
import FormHeader from "@/shared/components/form/FormHeader";
import { CheckCircle, X } from "lucide-react";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import ChoicePolice from "./ChoicePolice";


type FormContractProps = {
    onClose: () => void;
};

export default function FormContract({ onClose }: FormContractProps) {
    const storedVehicle = useStoreKey<VehicleModel[]>("vehicle");
    const [selectVehicle, setSelectVehicle] = useState<VehicleModel | null>(null);
    const [selectPolicies, setSelectPolicies] = useState<number[]>([]);
    const formRef = useRef<HTMLFormElement | null>(null);
    const { isPending, cleanErrors } = useFormStateAction(action, {
        onSuccess: async () => {
            cleanErrors();
        }
    });

    console.log(selectPolicies);
    function handleClose() {
        const current = formRef.current;
        if (current) current.reset();
        onClose();
    }

    function handleSelectPolice(id: number) {
        if (selectPolicies.find(item => item === id)) {
            const newSelectPolicies = selectPolicies.filter(item => item !== id);
            setSelectPolicies(newSelectPolicies);
            return;
        }
        setSelectPolicies((prev) => ([...prev, id]));
    }
    
    return (
        <>
            {storedVehicle && storedVehicle.length == 0 && <FormVehicle onClose={onClose} />}
            {storedVehicle && storedVehicle.length > 0 && (
                <form ref={formRef} className="max-w-4xl mx-auto p-6">
                    <div className="space-y-6">
                        <FormHeader title="Poliza assciurativa" description="Crea la tua poliza assicurativa con un click"
                        />
                        <div className="grid md:grid-cols-2 gap-6">
                            <ChoiceVehicle vehicleId={selectVehicle?.id} onSelectVehicle={setSelectVehicle} vehicles={storedVehicle} />
                        </div>
                        {!selectVehicle && <div>Ciao</div>}
                        {selectVehicle && (
                            <ChoicePolice
                                vehicleType={selectVehicle.type}
                                onSelectPolice={handleSelectPolice}
                                selectPolicies={selectPolicies}
                            />
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleClose}
                                type="reset"
                                className="cursor-pointer flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-gray-100 to-gray-200 text-balck py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                <X className="h-5 w-5" />
                                Chiudi
                            </button>
                            <button
                                type="submit"
                                className="cursor-pointer flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                <CheckCircle className="w-5 h-5" />
                                {isPending ? "Salvataggio..." : "Salva"}
                            </button>
                        </div>
                    </div>
                </form>
            )}

        </>
    );
}


async function action(formData: FormData): Promise<ActionResponse> {
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    return { success: true };
} 
