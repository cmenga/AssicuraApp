import { Car, CheckCircle, Eye, EyeOff, Mail, Shield, Lock } from "lucide-react";
import { useState } from "react";

export function LoginSection() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Login:', formData);
        // Qui collegherai il tuo backend
    };

    return (
        <>
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="hidden md:block">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
                            AssicuraFacile
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Bentornato nella tua area personale
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-xl">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Gestisci le tue polizze</h3>
                                    <p className="text-gray-600 text-sm">Controlla e modifica le tue assicurazioni in tempo reale</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <Car className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Denuncia sinistri</h3>
                                    <p className="text-gray-600 text-sm">Apri una pratica in pochi click, 24/7</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Documenti digitali</h3>
                                    <p className="text-gray-600 text-sm">Tutti i tuoi certificati sempre disponibili</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Accedi</h2>
                        <p className="text-gray-600">Inserisci le tue credenziali per continuare</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="tu@email.com"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Ricordami</span>
                            </label>
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

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Non hai un account?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Registrati ora
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}