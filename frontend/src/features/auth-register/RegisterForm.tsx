import { useState } from "react";
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Eye, EyeOff, FileText, Home, Lock, MapPin, User } from "lucide-react";

import { FormInputText } from "./components/FormInputText";
import { FormInputDate } from "./components/FormInputDate";
import { FormInputGender } from "./components/FormInputGender";
import type { RegisterFormModel } from "./type";
import { FormInputPhoneNumber } from "./components/FormInputPhoneNumber";
import { FormInputEmail } from "@/shared/components/form/FormInputEmail";



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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoria Patente <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.licenseCategory}
                            onChange={(e) => handleChange('categoriaPatente', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        >
                            <option value="A">A - Moto</option>
                            <option value="B">B - Auto</option>
                            <option value="C">C - Veicoli commerciali</option>
                            <option value="D">D - Autobus</option>
                        </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data Rilascio <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="date"
                                    required
                                    value={formData.licenseIssueDate}
                                    onChange={(e) => handleChange('dataRilascioPatente', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data Scadenza <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="date"
                                    required
                                    value={formData.licenseExpiryDate}
                                    onChange={(e) => handleChange('dataScadenzaPatente', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crea la tua Password</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    placeholder="Minimo 8 caratteri"
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Usa almeno 8 caratteri con lettere e numeri</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conferma Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confermaPassword', e.target.value)}
                                    placeholder="Ripeti la password"
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                required
                                checked={formData.acceptTerms}
                                onChange={(e) => handleChange('accettaTermini', e.target.checked)}
                                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                Accetto i{' '}
                                <a href="#" className="text-blue-600 hover:underline font-medium">
                                    Termini e Condizioni
                                </a>{' '}
                                <span className="text-red-500">*</span>
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                required
                                checked={formData.acceptPrivacyPolicy}
                                onChange={(e) => handleChange('accettaPrivacy', e.target.checked)}
                                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                Ho letto e accetto l'{' '}
                                <a href="#" className="text-blue-600 hover:underline font-medium">
                                    Informativa sulla Privacy
                                </a>{' '}
                                <span className="text-red-500">*</span>
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.subscribeToNewsletter}
                                onChange={(e) => handleChange('newsletter', e.target.checked)}
                                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                Desidero ricevere offerte esclusive e aggiornamenti via email
                            </span>
                        </label>
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