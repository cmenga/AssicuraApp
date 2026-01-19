import type { UserModel } from "@/shared/type";
import { User } from "lucide-react";
import BaseField from "./BaseField";

type AnagraphicProps = {
    user: UserModel;
};

export default function Anagraphic({ user }: AnagraphicProps) {

    return (
        <div className="bg-white rounded-2xl shadow-md p-6" >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Dati Anagrafici
                <p className="text-xs text-gray-500 mt-1">Non modificabile in app</p>
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
                <BaseField label="nome" field={user.first_name} />
                <BaseField label="cognome" field={user.last_name} />
                <BaseField label="codice Fiscale" field={user.fiscal_id} />
                <BaseField label="Data di Nascita" field={user.date_of_birth} />
                <BaseField label="Luogo di Nascita" field={user.place_of_birth} />
                <BaseField label="Sesso"field={user.gender === 'male' ? 'Maschio' : 'Femmina'} />
            </div>
        </div >
    );
}