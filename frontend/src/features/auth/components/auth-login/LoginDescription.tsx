import { Car, CheckCircle, Shield } from "lucide-react";

export default function LoginDescription() {
  return (
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
              <h3 className="font-semibold text-gray-900 mb-1">
                Gestisci le tue polizze
              </h3>
              <p className="text-gray-600 text-sm">
                Controlla e modifica le tue assicurazioni in tempo reale
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Denuncia sinistri
              </h3>
              <p className="text-gray-600 text-sm">
                Apri una pratica in pochi click, 24/7
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Documenti digitali
              </h3>
              <p className="text-gray-600 text-sm">
                Tutti i tuoi certificati sempre disponibili
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
