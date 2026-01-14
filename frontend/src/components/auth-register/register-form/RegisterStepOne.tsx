import { FormInputText } from "@/components/form/FormInputText";
import { FormInputDate } from "@/components/form/FormInputDate";
import { FormInputGender } from "@/components/form/FormInputGender";

import { FormHeader } from "./FormHeader";
import { FileText, MapPin, User } from "lucide-react";
import { getMaxRegisterDate, handleNameKeyPress } from "@/utils/auth.register.utils";
import { ErrorMessage } from "./ErrorMessage";


type RegisterSteOneProps = {
    firstName: string;
    lastName: string;
    fiscalId: string;
    dateOfBirth: string;
    placeOfBirth: string;
    gender: string;
    errors?: Record<string, string>;
};

export function RegisterStepOne(props: RegisterSteOneProps) {
    const { firstName, lastName, fiscalId, dateOfBirth, placeOfBirth, gender, errors } = props;

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
                    onKeyDown={handleNameKeyPress}
                >
                    {errors?.first_name && <ErrorMessage message={errors.first_name} />}
                </FormInputText>
                <FormInputText
                    labelName="Cognome"
                    icon={User}
                    placeholder="Rossi"
                    name="last_name"
                    previous={lastName}
                >
                    {errors?.last_name && <ErrorMessage message={errors.last_name} />}
                </FormInputText>
            </div>

            <FormInputText
                labelName="Codice Fiscale"
                icon={FileText}
                placeholder="RSSMRA80A01H501U"
                name="fiscal_id"
                maxLength={16}
                minLength={16}
                previous={fiscalId}
            >
                {errors?.fiscal_id && <ErrorMessage message={errors.fiscal_id} />}
            </FormInputText>


            <div className="grid md:grid-cols-2 gap-6">
                <FormInputDate
                    labelName="Data di Nascita"
                    max={getMaxRegisterDate()}
                    name="date_of_birth"
                    previous={dateOfBirth}
                >
                    {errors?.date_of_birth && <ErrorMessage message={errors.date_of_birth} />}
                </FormInputDate>
                <FormInputText
                    labelName="Luogo di Nascita"
                    icon={MapPin}
                    placeholder="Roma"
                    name="place_of_birth"
                    previous={placeOfBirth}
                >
                    {errors?.place_of_birth && <ErrorMessage message={errors.place_of_birth} />}
                </FormInputText>
            </div>

            <FormInputGender
                labelName="Sesso"
                name="gender"
                previous={gender}
            />
        </div>
    );

}