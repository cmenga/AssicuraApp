import { VEHICLE_TYPE } from "@/features/home/constant";
import { vehicleApi } from "@/shared/api/http";
import FormHeader from "@/shared/components/form/FormHeader";
import FormInputDropdown from "@/shared/components/form/FormInputDropdown";
import FormInputText from "@/shared/components/form/FormInputText";
import { ErrorMessage } from "@/shared/components/form/FormMessage";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import { store } from "@/shared/store";
import type { ActionResponse, VehicleModel } from "@/shared/type";
import { handleBrandKeyPress, handleDrivingLicenseKeyPress, handleModelKeyPress } from "@/shared/utils/onKeyDown";
import { CarIcon, CheckCircle, IdCard, X } from "lucide-react";


type UpdateFormProps = {
    onClose: () => void;
    vehicle: VehicleModel;
};

export default function UpdateForm({ onClose, vehicle }: UpdateFormProps) {

    const { errors, isPending, cleanErrors, submitAction } = useFormStateAction(action, {
        onSuccess: async () => {
            cleanErrors();
            await dispatch();
            onClose();
        }
    });
    return (
        <form onSubmit={submitAction} className="max-w-4xl mx-auto p-6">
            <input className="hidden" type="text" name="vehicle_id" readOnly value={vehicle.id} />
            <div className="space-y-6">
                <FormHeader
                    title="Modifica veicolo"
                    description="Qui puoi inserire i dati riferenti al tuo veicolo."
                />
                {errors?.error && <ErrorMessage message={errors.error} />}
                <FormInputDropdown
                    labelName="Tipologia"
                    options={VEHICLE_TYPE}
                    name="type"
                />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormInputText
                        name="license_plate"
                        labelName="Targa"
                        previous={vehicle.license_plate}
                        maxLength={7}
                        minLength={7}
                        placeholder="BB111RB"
                        icon={IdCard}
                        onKeyDown={handleDrivingLicenseKeyPress}
                    >
                        {errors?.license_plate && <ErrorMessage message={errors.license_plate} />}
                    </FormInputText>
                    <FormInputText
                        labelName="Matricola"
                        name="vin"
                        previous={vehicle.vin}
                        maxLength={17}
                        minLength={17}
                        onKeyDown={handleDrivingLicenseKeyPress}
                        placeholder="ZFA15200005123456"
                    >
                        {errors?.vin && <ErrorMessage message={errors.vin} />}
                    </FormInputText>
                    <FormInputText
                        labelName="Marca"
                        name="brand"
                        placeholder="Fiat"
                        onKeyDown={handleBrandKeyPress}
                        maxLength={50}
                        minLength={2}
                        previous={vehicle.brand}
                    >
                        {errors?.brand && <ErrorMessage message={errors.brand} />}
                    </FormInputText>
                    <FormInputText
                        labelName="Modello"
                        name="model"
                        placeholder="Peugeot 3008"
                        onKeyDown={handleModelKeyPress}
                        maxLength={50}
                        minLength={2}
                        previous={vehicle.model}
                        icon={CarIcon}
                    >
                        {errors?.model && <ErrorMessage message={errors.model} />}
                    </FormInputText>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
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
    );
}


async function action(formData: FormData): Promise<ActionResponse> {
    const data = Object.fromEntries(formData.entries());
    const {vehicle_id, ...updateData} = data
    const response = await vehicleApi.patch(`/update/${vehicle_id}`, updateData);
    if (response.status == 422) {
        let errors = {};
        response.data.errors.forEach((err: Record<string, string>) => (
            errors = {
                ...errors,
                [err.field]: err.message
            }
        ));
        return { success: false, errors: errors };
    }
    if (response.status >= 500) {
        return { success: false, errors: { error: "Al momente il servizio non è disponibile" } };
    }
    return { success: true };
}

async function dispatch() {
    const response = await vehicleApi.get("/vehicles");
    if (response.status == 200) {
        const newData: VehicleModel[] = response.data.map((element: VehicleModel) => ({ ...element }));
        store.set<VehicleModel[]>("vehicle", newData);
    }
}