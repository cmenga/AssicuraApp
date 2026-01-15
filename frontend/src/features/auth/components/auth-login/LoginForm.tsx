
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import { FormInputEmail } from "@/shared/components/form/FormInputEmail";
import { FormInputPassword } from "@/shared/components/form/FormInputPassword";

import { FormInputCheckbox } from "@/shared/components/form/FormInputCheckbox";
import { ErrorMessage } from "@/shared/components/form/ErrorMessage";

import type { UserLoginDTO } from "../../type";
import { submitUserLogin } from "../../action"; 


export function LoginForm() {
    const confirm_message: string | null = sessionStorage.getItem("sign-up");
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Record<string, FormDataEntryValue>;

        const mergedData: UserLoginDTO = {
            email: String(data["email"]),
            password: String(data["password"]),
        };
        const isRemember = Boolean(data["rememberMe"])
        const response = await submitUserLogin(mergedData,isRemember);
        if (response.success) {
            sessionStorage.removeItem("sign-up");
            navigate({ to: "/home" });
        }
        response.errors && setError(response.errors.user);
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Accedi</h2>
                <p className="text-gray-600">Inserisci le tue credenziali per continuare</p>
                {confirm_message && (<p className="text-green-600 text-sm bg-green-50 border-sm rounded-sm p-2 mt-2">
                    Registrazione avvenuta con successo, accedi per confermare la patente
                </p>)}
                {error && <ErrorMessage message={error} />}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInputEmail
                    placeholder="mario.rossi@example.com"
                    autoComplete="username"
                    name="email"
                />
                <FormInputPassword
                    labelName="Password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    name="password"
                />
                <div className="flex items-center justify-between">
                    <FormInputCheckbox name="rememberMe">
                        <span className="text-sm text-gray-700">Ricordami</span>
                    </FormInputCheckbox>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Password dimenticata?
                    </a>
                </div>

                <button
                    type="submit"
                    className="cursor-pointer w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                    Accedi
                </button>
            </form>
            <div className="mt-8 text-center">
                <p className="text-gray-600 ">
                    Non hai un account?{' '}
                    <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold ">
                        Registrati ora
                    </Link>
                </p>
            </div>
        </div>
    );
};