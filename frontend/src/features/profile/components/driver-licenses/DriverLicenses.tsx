import {
  CheckCircle,
  CreditCard,
} from "lucide-react";

import DriverLicense from "./DriverLicense";

const patenti = [
  {
    id: 1,
    numero: "U1ABC1234567",
    categoria: "B",
    dataRilascio: "2005-06-15",
    dataScadenza: "2030-06-15",
    enteRilascio: "Motorizzazione Civile di Roma",
    stato: "Valida",
  },
  {
    id: 2,
    numero: "U1XYZ9876543",
    categoria: "A",
    dataRilascio: "2010-03-20",
    dataScadenza: "2030-03-20",
    enteRilascio: "Motorizzazione Civile di Roma",
    stato: "Valida",
  },
];

export default function DriverLicenses() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Visualizza tutte le tue patenti registrate
        </p>
      </div>

      <div className="grid md:grid-cols-2">
        {patenti.map((value, index) => {
          return <DriverLicense key={index} code={value.categoria} expiryDate={value.dataScadenza} issueDate={value.dataRilascio} licenseNumber={value.id.toString()} />;
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 text-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition cursor-pointer">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Aggiungi Nuova Patente
        </h3>
        <p className="text-gray-600 mb-4">
          Registra un'altra patente al tuo profilo
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
          Aggiungi Patente
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Perché registrare la patente?
            </h4>
            <p className="text-sm text-gray-600">
              Avere la patente registrata ci permette di calcolare preventivi
              più accurati e di inviarti promemoria automatici prima della
              scadenza.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
