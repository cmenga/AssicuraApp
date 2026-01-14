import { FormHeader } from "./FormHeader";
import { FormInputEmail } from "@/components/form/FormInputEmail";
import { FormInputPhoneNumber } from "@/components/form/FormInputPhoneNumber";
import { FormInputText } from "@/components/form/FormInputText";
import { Home } from "lucide-react";


type RegisterStepTwoProps = {
    email: string;
    phoneNumber: string;
    street: string;
    civicNumber: string;
    cap: string;
    city: string;
    province: string;
};

export function RegisterStepTwo(props: RegisterStepTwoProps) {
    const { cap, city, civicNumber, email, phoneNumber, province, street } = props;
    return (
        <div className="space-y-6">
            <FormHeader
                title="Residenza e Contatti"
                description="Dove possiamo raggiungerti?"
            />

            <FormInputEmail
                isRequired
                placeholder="mario.rossi@email.com"
                name="email"
                previous={email}
            />

            <FormInputPhoneNumber
                placeholder="+39 333 1234567"
                name="phone_number"
                previous={phoneNumber}
            />

            <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Indirizzo di Residenza</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <FormInputText
                        labelName="Via/Piazza"
                        icon={Home}
                        placeholder="Via Roma"
                        name="street"
                        previous={street}
                    />

                    <FormInputText
                        labelName="Civico"
                        placeholder="123"
                        name="civic_number"
                        previous={civicNumber}
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <FormInputText
                        labelName="CAP"
                        placeholder="00100"
                        pattern="[0-9]{5}"
                        maxLength={5}
                        name="cap"
                        previous={cap}
                    />
                    <FormInputText
                        labelName="Città"
                        placeholder="Roma"
                        name="city"
                        previous={city}
                    />
                    <FormInputText
                        labelName="Provincia"
                        placeholder="RM"
                        maxLength={2}
                        name="province"
                        previous={province}
                    />
                </div>
            </div>
        </div>
    );
}