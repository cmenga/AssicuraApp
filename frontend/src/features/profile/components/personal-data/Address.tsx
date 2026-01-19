import { MapPin, Pencil, Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import BaseField from "./BaseField";
import type { AddressModel } from "@/shared/type";
import FormInputText from "@/shared/components/form/FormInputText";

type AddressProps = {
    address: AddressModel;
};
export default function Address({ address }: AddressProps) {
    const [editMode, setEditMode] = useState<boolean>(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setEditMode(false);
        alert("Lanciare la chiamata al backend");
    }
    return (
        <div className="relative bg-white rounded-2xl shadow-md p-6">
            {!editMode && <Pencil onClick={() => setEditMode(true)} className="cursor-pointer absolute right-4 w-6 h-6 text-gray-600" />}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Residenza
            </h3>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                {!editMode && (
                    <>
                        <div className="md:col-span-2">
                            <BaseField field={address.street} label="Indirizzo" />
                        </div>
                        <BaseField field={address.civic_number} label="Civico" />
                        <BaseField field={address.city} label="Città" />
                        <BaseField field={address.cap} label="Cap" />
                        <BaseField field={address.province} label="Provincia" />

                    </>
                )}
                {editMode && (
                    <>
                        <div className="md:col-span-2">
                            <FormInputText labelName="Indirizzo" name="street" previous={address.street} />
                        </div>
                        <FormInputText labelName="Civico" name="civic_number" previous={address.civic_number} />
                        <FormInputText labelName="Città" name="city" previous={address.city} />
                        <FormInputText labelName="Cap" name="cap" previous={address.cap.toString()} />
                        <FormInputText labelName="Provincia" name="province" previous={address.province} />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditMode(false)}
                                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
                            >
                                <X className="w-5 h-5" />
                                Annulla
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                            >
                                <Save className="w-5 h-5" />
                                Salva
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>

    );
}