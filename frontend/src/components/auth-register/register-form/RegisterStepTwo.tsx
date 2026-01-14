import { FormHeader } from "./FormHeader";
import { FormInputEmail } from "@/components/form/FormInputEmail";
import { FormInputPhoneNumber } from "@/components/form/FormInputPhoneNumber";
import { FormInputText } from "@/components/form/FormInputText";
import { Home } from "lucide-react";
import { ErrorMessage } from "./ErrorMessage";


type RegisterStepTwoProps = {
    email: string;
    phoneNumber: string;
    street: string;
    civicNumber: string;
    cap: string;
    city: string;
    province: string;
    errors?: Record<string, string>;
};

export function RegisterStepTwo(props: RegisterStepTwoProps) {
    const { cap, city, civicNumber, email, phoneNumber, province, street, errors } = props;

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
            >
                {errors?.email && <ErrorMessage message={errors.email} />}
            </FormInputEmail>

            <FormInputPhoneNumber
                placeholder="3331234567"
                name="phone_number"
                previous={phoneNumber}
                maxLength={10}
                minLength={10}
            >
                {errors?.phone_number && <ErrorMessage message={errors.phone_number} />}
            </FormInputPhoneNumber>

            <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className={`text-lg font-semibold text-gray-900 ${errors?.residence_province ? "" : "mb-4"}`}>Indirizzo di Residenza</h3>
                {errors?.residence_province && (
                    <p className="text-red-600 text-sm bg-red-50 border-sm rounded-sm p-2 mb-4">
                        {errors.residence_province}
                    </p>
                )}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <FormInputText
                        labelName="Via/Piazza"
                        icon={Home}
                        placeholder="Via Roma"
                        name="street"
                        previous={street}
                    >
                        {errors?.street && <ErrorMessage message={errors.street} />}
                    </FormInputText>

                    <FormInputText
                        labelName="Civico"
                        placeholder="123"
                        name="civic_number"
                        previous={civicNumber}
                    >
                        {errors?.civic_number && <ErrorMessage message={errors.civic_number} />}
                    </FormInputText>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <FormInputText
                        labelName="CAP"
                        placeholder="00100"
                        pattern="[0-9]{5}"
                        maxLength={5}
                        name="cap"
                        previous={cap}
                    >
                        {errors?.cap && <ErrorMessage message={errors.cap} />}
                    </FormInputText>
                    <FormInputText
                        labelName="Città"
                        placeholder="Roma"
                        name="city"
                        previous={city}
                    >
                        {errors?.city && <ErrorMessage message={errors.city} /> }
                    </FormInputText>
                    <FormInputText
                        labelName="Provincia"
                        placeholder="RM"
                        maxLength={2}
                        name="province"
                        previous={province}
                    >
                        {errors?.province && <ErrorMessage message={errors.province} />}
                    </FormInputText>
                </div>
            </div>
        </div>
    );
}