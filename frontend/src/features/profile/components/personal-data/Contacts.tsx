import FormInputEmail from "@/shared/components/form/FormInputEmail";
import { Mail, Pencil, Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import BaseField from "./BaseField";
import FormInputPhoneNumber from "@/shared/components/form/FormInputPhoneNumber";

type ContactsProps = {
    email: string;
    phoneNumber: string;
};

export default function Contacts({ email, phoneNumber }: ContactsProps) {
    const [editMode, setEditMode] = useState<boolean>(false);


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("Entra nel submit");
        setEditMode(false);
        alert("Effettuare la chiamata al backend");
    }

    return (
        <div className="relative bg-white rounded-2xl shadow-md p-6">
            {!editMode && <Pencil onClick={() => setEditMode(true)} className="cursor-pointer absolute right-4 w-6 h-6 text-gray-600" />}

            <h3 className=" text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" >
                <Mail className="w-6 h-6 text-blue-600" />
                Contatti
            </h3 >
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                {editMode && (
                    <>
                        <FormInputEmail previous={email} name="email" />
                        <FormInputPhoneNumber previous={phoneNumber} name="phone_number" />
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
                {!editMode && (
                    <>
                        <BaseField field={email} label="email" />
                        <BaseField field={phoneNumber} label="telefono" />
                    </>

                )}

            </form>
        </div>
    );
}

