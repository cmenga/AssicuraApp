import { FormInputEmail } from "@/shared/components/form/FormInputEmail";
import { Password } from "@/shared/components/form/Password";
import { useState, type FormEvent } from "react";
import { RememberMe } from "./components/RememberMe";


export function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Login:', formData);
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Accedi</h2>
                <p className="text-gray-600">Inserisci le tue credenziali per continuare</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInputEmail onFormData={(e) => setFormData({ ...formData, email: e.target.value })} previous={formData.email} />
                <Password onFormData={(e) => setFormData({ ...formData, password: e.target.value })} previous={formData.password} />
                <div className="flex items-center justify-between">
                    <RememberMe onFormData={(e) => e.target.checked} previous={formData.rememberMe} />
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Password dimenticata?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                    Accedi
                </button>
            </form>
            {/* TODO: aggiungere Link di Tanstack per la navigazione */}
            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Non hai un account?{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Registrati ora
                    </a>
                </p>
            </div>
        </div>
    );
};