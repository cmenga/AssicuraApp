import { Clock, Euro, Phone, Shield } from "lucide-react";

const benefits = [
  {
    icon: <Euro className="w-8 h-8" />,
    title: "Prezzi Trasparenti",
    description:
      "Nessun costo nascosto. Preventivi chiari e convenienti in pochi secondi.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Attivazione Immediata",
    description:
      "La tua polizza è attiva subito dopo l'acquisto, 24 ore su 24.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Copertura Completa",
    description: "Protezione totale con garanzie accessorie personalizzabili.",
  },
  {
    icon: <Phone className="w-8 h-8" />,
    title: "Assistenza Dedicata",
    description:
      "Supporto clienti sempre disponibile via chat, email o telefono.",
  },
];

export default function Benefits() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Perché Scegliere AssicuraFacile
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            L'assicurazione moderna che semplifica la tua vita
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-blue-600 mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
