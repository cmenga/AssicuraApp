import { FormInputText } from "@/components/form/FormInputText";
import { FormInputDate } from "@/components/form/FormInputDate";
import { FormInputGender } from "@/components/form/FormInputGender";

import { FormHeader } from "./FormHeader";
import { FileText, MapPin, User } from "lucide-react";


type RegisterSteOneProps = {
    firstName: string
    lastName: string
    fiscalId: string
    dateOfBirth: string
    placeOfBirth: string
    gender: string
};

//TODO: da aggiungere il previous per evitare la perdita di dati, essendo che dopo la submit verranno cancellati
export function RegisterStepOne(props: RegisterSteOneProps) {
    const { firstName,lastName,fiscalId,dateOfBirth,placeOfBirth,gender} = props;
    
    return (
        <div className="space-y-6">
            <FormHeader
                title="Dati Personali"
                description="Inserisci i tuoi dati anagrafici" />

            <div className="grid md:grid-cols-2 gap-6">
                <FormInputText
                    labelName="Nome"
                    icon={User}
                    placeholder="Mario"
                    name="first_name"
                    previous={firstName}
                />
                <FormInputText
                    labelName="Cognome"
                    icon={User}
                    placeholder="Rossi"
                    name="last_name"
                    previous={lastName}
                />
            </div>

            <FormInputText
                labelName="Codice Fiscale"
                icon={FileText}
                placeholder="RSSMRA80A01H501U"
                name="fiscal_id"
                previous={fiscalId}
            >
                <p className="text-xs text-gray-500 mt-1">16 caratteri alfanumerici</p>
            </FormInputText>


            <div className="grid md:grid-cols-2 gap-6">
                <FormInputDate
                    labelName="Data di Nascita"
                    max={new Date().toISOString().split('T')[0]}
                    name="date_of_birth"
                    previous={dateOfBirth}
                />
                <FormInputText
                    labelName="Luogo di Nascita"
                    icon={MapPin}
                    placeholder="Roma"
                    name="place_of_birth"
                    previous={placeOfBirth}
                />
            </div>

            <FormInputGender
                labelName="Sesso"
                name="gender"
                previous={gender}
            />
        </div>
    );

}