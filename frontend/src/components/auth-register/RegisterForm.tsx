import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

import type { RegisterDTO } from "@/type/auth.register.type";
import { RegisterStepOne } from "./register-form/RegisterStepOne";
import { useState } from "react";
import { RegisterStepTwo } from "./register-form/RegisterStepTwo";
import { RegisterStepThree } from "./register-form/RegisterStepThree";



const FORM_STATE_INIT: RegisterDTO = {
    first_name: '',
    last_name: '',
    place_of_birth: '',
    date_of_birth: '',
    fiscal_id: '',
    gender: '',
    cap: '',
    city: '',
    civic_number: '',
    email: '',
    phone_number: '',
    province: '',
    street: '',
    password: '',
    confirm_password: '',
    license_category: 'A',
    license_expiry_date: '',
    license_issue_date: '',
    license_number: '',
    accept_terms: true,
    accept_privacy_policy: true,
    subscribe_to_newsletter: false
};



type RegisterFormProps = {
    currentStep: number;
    onCurrentStep: (current: number) => void;
};

export function RegisterForm(props: RegisterFormProps) {
    const { currentStep, onCurrentStep } = props;
    const [formData, setState] = useState<RegisterDTO>(FORM_STATE_INIT);
    console.log(formData);

    function handleSubmit(e: any) {
        e.preventDefault();
        if (currentStep < 3) {
            onCurrentStep(currentStep + 1);
            const newFormData = new FormData(e.currentTarget);
            const data = Object.fromEntries(newFormData.entries());
            setState(prev => ({ ...prev, ...data }));


        } else {
            const newFormData = new FormData(e.currentTarget);
            const data = Object.fromEntries(newFormData.entries());
            setState(prev => ({ ...prev, ...data }));
            alert('Registrazione completata! (collegare al backend)');
        }
    };

    function goToPrevStep() {
        if (currentStep > 1) {
            onCurrentStep(currentStep - 1);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {currentStep === 1 && <RegisterStepOne
                firstName={formData.first_name}
                lastName={formData.last_name}
                placeOfBirth={formData.place_of_birth}
                dateOfBirth={formData.date_of_birth}
                fiscalId={formData.fiscal_id}
                gender={formData.gender}
            />
            }
            {currentStep === 2 && <RegisterStepTwo
                cap={formData.cap}
                city={formData.city}
                civicNumber={formData.civic_number}
                email={formData.email}
                phoneNumber={formData.phone_number}
                province={formData.province}
                street={formData.street}
            />}

            {currentStep === 3 && <RegisterStepThree
                acceptPrivacyPolicy={formData.accept_privacy_policy}
                acceptTerms={formData.accept_terms}
                confirmPassword={formData.confirm_password}
                licenseCategory={formData.license_category}
                licenseExpiryDate={formData.license_expiry_date}
                licenseIssueDate={formData.license_issue_date}
                licenseNumber={formData.license_number}
                subscribeToNewsletter={formData.subscribe_to_newsletter}
                password={formData.password}
            />}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={goToPrevStep}
                        className="flex items-center justify-center gap-2 flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Indietro
                    </button>
                )}
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    {currentStep < 3 ? (
                        <>
                            Continua
                            <ChevronRight className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Completa Registrazione
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}


