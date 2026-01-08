import { useState } from "react";
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Eye, EyeOff, FileText, Home, Lock, MapPin, User } from "lucide-react";

import { FormInputText } from "./components/FormInputText";
import { FormInputDate } from "./components/FormInputDate";
import { FormInputGender } from "./components/FormInputGender";
import type { RegisterFormModel } from "./type";
import { FormInputPhoneNumber } from "./components/FormInputPhoneNumber";
import { FormInputEmail } from "@/shared/components/form/FormInputEmail";
import { FormInputDropdown, type DropdownOptions } from "./components/FormInputDropdown";
import { FormInputPassword } from "@/shared/components/form/FormInputPassword";
import { FormInputCheckbox } from "@/shared/components/form/FormInputCheckbox";



const FORM_STATE_INIT: RegisterFormModel = {
    // Dati personali
    firstName: '',
    lastName: '',
    fiscalId: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    // Contatti
    email: '',
    phoneNumber: '',
    // Residenza
    street: '',
    civicNumber: '',
    cap: '',
    city: '',
    province: '',
    // Patente
    licenseNumber: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    licenseCategory: 'B',
    //Account
    password: '',
    confirmPassword: '',
    acceptPrivacyPolicy: false,
    acceptTerms: false,
    subscribeToNewsletter: false
};

const LICENSE_OPTIONS: DropdownOptions[] = [
    { value: "A", name: "A - Moto" },
    { value: "B", name: "B - Auto" },
    { value: "C", name: "C - Veicoli commerciali" }
];

export function RegisterForm() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(FORM_STATE_INIT);

    const handleChange = (field: any, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Validazione password
            if (formData.password !== formData.confirmPassword) {
                alert('Le password non corrispondono!');
                return;
            }
            if (formData.password.length < 8) {
                alert('La password deve essere di almeno 8 caratteri!');
                return;
            }
            console.log('Dati registrazione:', formData);
            // Qui collegherai il tuo backend
            alert('Registrazione completata! (collegare al backend)');
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Step 1: Dati Personali */}
            {currentStep === 1 && (
                <div className="space-y-6">
                    <FormHeader
                        title="Dati Personali"
                        description="Inserisci i tuoi dati anagrafici" />

                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInputText
                            label="Nome"
                            icon={User}
                            onFormData={(e) => { setFormData({ ...formData, firstName: e.target.value }); }}
                            previous={formData.firstName}
                            placeholder="Mario"
                        />
                        <FormInputText
                            label="Cognome"
                            icon={User}
                            onFormData={(e) => { setFormData({ ...formData, lastName: e.target.value }); }}
                            previous={formData.lastName}
                            placeholder="Rossi"
                        />
                    </div>

                    <FormInputText
                        label="Codice Fiscale"
                        icon={FileText}
                        onFormData={(e) => setFormData({ ...formData, fiscalId: e.target.value })}
                        previous={formData.fiscalId}
                        placeholder="RSSMRA80A01H501U"
                    >
                        <p className="text-xs text-gray-500 mt-1">16 caratteri alfanumerici</p>
                    </FormInputText>


                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInputDate
                            label="Data di Nascita"
                            onFormData={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            previous={formData.dateOfBirth}
                        />
                        <FormInputText
                            label="Luogo di Nascita"
                            icon={MapPin}
                            onFormData={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                            previous={formData.placeOfBirth}
                            placeholder="Roma"
                        />
                    </div>

                    <FormInputGender
                        onFormData={handleChange}
                        previous={formData.gender}
                    />
                </div>
            )}

            {/* Step 2: Residenza e Contatti */}
            {currentStep === 2 && (
                <div className="space-y-6">
                    <FormHeader
                        title="Residenza e Contatti"
                        description="Dove possiamo raggiungerti?"
                    />

                    <FormInputEmail
                        onFormData={(e) => setFormData({ ...formData, email: e.target.value })}
                        previous={formData.email}
                        isRequired
                    />

                    <FormInputPhoneNumber
                        onFormData={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        previous={formData.phoneNumber}
                    />

                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Indirizzo di Residenza</h3>
                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <FormInputText
                                label="Via/Piazza"
                                icon={Home}
                                onFormData={(e) => setFormData({ ...formData, street: e.target.value })}
                                previous={formData.street}
                                placeholder="Via Roma"
                            />

                            <FormInputText
                                label="Civico"
                                onFormData={(e) => setFormData({ ...formData, civicNumber: e.target.value })}
                                previous={formData.civicNumber}
                                placeholder="123"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <FormInputText
                                label="CAP"
                                onFormData={(e) => setFormData({ ...formData, cap: e.target.value })}
                                previous={formData.cap}
                                placeholder="00100"
                                pattern="[0-9]{5}"
                                maxLength={5}
                            />
                            <FormInputText
                                label="Città"
                                onFormData={(e) => setFormData({ ...formData, city: e.target.value })}
                                previous={formData.city}
                                placeholder="Roma"
                            />
                            <FormInputText
                                label="Provincia"
                                onFormData={(e) => setFormData({ ...formData, province: e.target.value })}
                                previous={formData.province}
                                placeholder="RM"
                                maxLength={2}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Patente e Account */}
            {currentStep === 3 && (
                <div className="space-y-6">
                    <FormHeader
                        title="Patente e Account"
                        description="Ultimi dettagli per completare la registrazione"
                    />
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <strong>Info:</strong> I dati della patente sono necessari per calcolare il preventivo assicurativo più accurato
                        </p>
                    </div>

                    <FormInputText
                        label="Numero Patente"
                        onFormData={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        previous={formData.licenseNumber}
                        icon={FileText}
                        placeholder="U1ABC1234567"
                    />

                    <FormInputDropdown
                        label="Categoria Patente"
                        onFormData={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                        previous={formData.licenseCategory}
                        options={LICENSE_OPTIONS}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInputDate
                            label="Data Rialscio"
                            onFormData={(e) => setFormData({ ...formData, licenseIssueDate: e.target.value })}
                            previous={formData.licenseIssueDate}
                        />
                        <FormInputDate
                            label="Date Scadenza"
                            onFormData={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                            previous={formData.licenseExpiryDate}
                        />
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crea la tua Password</h3>
                        <FormInputPassword
                            label="Password"
                            onFormData={(e) => setFormData({ ...formData, password: e.target.value })}
                            previous={formData.password}
                            isRequired
                            placeholder="••••••••"
                            minLenght={8}
                        />
                        <FormInputPassword
                            label="Conferma Password"
                            onFormData={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            previous={formData.confirmPassword}
                            isRequired
                            placeholder="Ripeti la password"
                            minLenght={8}
                        />
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        <FormInputCheckbox
                            onFormData={(e) => setFormData({ ...formData, acceptPrivacyPolicy: e.target.checked })}
                            previous={formData.acceptTerms}
                        >
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                Accetto i{' '}
                                <a href="#" className="text-blue-600 hover:underline font-medium">
                                    Termini e Condizioni
                                </a>{' '}
                                <span className="text-red-500">*</span>
                            </span>
                        </FormInputCheckbox>

                        <FormInputCheckbox
                            onFormData={(e) => setFormData({ ...formData, acceptPrivacyPolicy: e.target.checked })}
                            previous={formData.acceptPrivacyPolicy}
                        >
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                Ho letto e accetto l'{' '}
                                <a href="#" className="text-blue-600 hover:underline font-medium">
                                    Informativa sulla Privacy
                                </a>{' '}
                                <span className="text-red-500">*</span>
                            </span>
                        </FormInputCheckbox>

                        <FormInputCheckbox
                            onFormData={(e) => setFormData({ ...formData, subscribeToNewsletter: e.target.checked })}
                            previous={formData.subscribeToNewsletter}
                        >
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                Desidero ricevere offerte esclusive e aggiornamenti via email
                            </span>
                        </FormInputCheckbox>
                    </div>
                </div>
            )}

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



type FormHeaderProps = {
    title: string;
    description: string;
};

function FormHeader(props: FormHeaderProps) {
    const { title, description } = props;
    return (
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}