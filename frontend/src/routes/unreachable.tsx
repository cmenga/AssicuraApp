import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Clock, Mail, Phone } from 'lucide-react';

export const Route = createFileRoute('/unreachable')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        AssicuraFacile
                    </h1>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
                        <AlertCircle className="w-10 h-10 text-orange-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Servizio Temporaneamente Non Disponibile
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Il servizio attualmente non è disponibile, ci scusiamo per il disagio.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-3 text-blue-800">
                            <Clock className="w-6 h-6" />
                            <p className="font-medium">Tempo stimato: pochi minuti</p>
                        </div>
                    </div>


                    <div className="border-t border-gray-200 pt-6">
                        <p className="text-gray-600 mb-4">
                            Per urgenze puoi contattarci:
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-700">
                            <a
                                href="tel:8001234567"
                                className="flex items-center gap-2 hover:text-blue-600 transition"
                            >
                                <Phone className="w-5 h-5" />
                                <span className="font-medium">800 123 456</span>
                            </a>
                            <span className="hidden sm:block text-gray-400">•</span>
                            <a
                                href="mailto:info@assicurafacile.it"
                                className="flex items-center gap-2 hover:text-blue-600 transition"
                            >
                                <Mail className="w-5 h-5" />
                                <span className="font-medium">info@assicurafacile.it</span>
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-gray-500 mt-8 text-sm">
                    Ci scusiamo per il disagio • AssicuraFacile &copy; 2026
                </p>
            </div>
        </div>
    )
}
