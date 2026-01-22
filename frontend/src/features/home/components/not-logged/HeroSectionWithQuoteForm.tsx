import { Bike, Car, CheckCircle, Truck } from "lucide-react";
import { useState } from "react";

const vehicles = [
  { id: "auto", name: "Auto", icon: <Car className="w-6 h-6" /> },
  { id: "moto", name: "Moto", icon: <Bike className="w-6 h-6" /> },
  { id: "furgone", name: "Furgone", icon: <Truck className="w-6 h-6" /> },
];

export default function HeroSectionWithQuoteForm() {
  const [selectedVehicle, setSelectedVehicle] = useState("auto");

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-600 via-blue-500 to-cyan-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-8">
          <div className="text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Assicurazione Auto 100% Digitale
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Risparmia fino al 40% con la nostra assicurazione online.
              Preventivo gratuito in 2 minuti!
            </p>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg">Attivazione immediata</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg">Zero burocrazia</span>
              </div>
            </div>
          </div>

          {/* Quote Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Calcola il tuo preventivo
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo di veicolo
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
                        selectedVehicle === vehicle.id
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {vehicle.icon}
                      <span className="text-sm font-medium">
                        {vehicle.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Targa veicolo
                </label>
                <input
                  type="text"
                  placeholder="ES: AB123CD"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data di nascita
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <button className="w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
                Calcola Preventivo Gratuito
              </button>

              <p className="text-xs text-gray-500 text-center">
                Nessun impegno richiesto • Preventivo in 2 minuti
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
