import { useStoreKey } from "@/shared/hooks/useStoreKey";
import type { VehicleModel } from "@/shared/type";
import FormVehicle from "./vehicle/FormVehicle";
import ChoiceVehicle from "./vehicle/ChoiceVehicle";
import { useState } from "react";
import FormHeader from "@/shared/components/form/FormHeader";


type FormNewContractProps = {
    onClose: () => void;
};
export default function FormNewContract({ onClose }: FormNewContractProps) {
    const storedVehicle = useStoreKey<VehicleModel[]>("vehicle");
    const [selectVehicle, setSelectVehicle] = useState<VehicleModel | null>(null);

    return (
        <>
            {storedVehicle && storedVehicle.length == 0 && <FormVehicle onClose={onClose} />}
            <form className="max-w-4xl mx-auto p-6">
                <div className="space-y-6">
                    <FormHeader title="Poliza assciurativa" description="Crea la tua poliza assicurativa con un click"
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                        {storedVehicle && storedVehicle.length > 0 && <ChoiceVehicle vehicleId={selectVehicle?.id} onSelectVehicle={setSelectVehicle} vehicles={storedVehicle} />}
                    </div>



                </div>
            </form>
        </>
    );
}



