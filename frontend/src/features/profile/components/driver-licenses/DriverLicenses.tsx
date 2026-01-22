import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CreditCard,
  Edit,
  FileText,
} from "lucide-react";

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

const getDaysUntilExpiry = (expiry: any) => {
  const today: Date = new Date();
  const expiryDate: Date = new Date(expiry);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function DriverLicenses() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Visualizza tutte le tue patenti registrate
        </p>
      </div>

      {patenti.map((patente) => {
        const daysLeft = getDaysUntilExpiry(patente.dataScadenza);
        const isExpiringSoon = daysLeft < 180;

        return (
          <div
            key={patente.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div
                  className={`p-4 rounded-xl ${
                    patente.stato === "Valida" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <CreditCard
                    className={`w-8 h-8 ${
                      patente.stato === "Valida"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Patente Categoria {patente.categoria}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        patente.stato === "Valida"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {patente.stato}
                    </span>
                  </div>
                  <p className="text-gray-600">Numero: {patente.numero}</p>
                </div>
              </div>
            </div>

            {isExpiringSoon && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    La patente scade tra {daysLeft} giorni. Ricordati di
                    rinnovarla!
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data Rilascio
                </label>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(patente.dataRilascio).toLocaleDateString("it-IT")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data Scadenza
                </label>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(patente.dataScadenza).toLocaleDateString("it-IT")}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Ente Rilascio
                </label>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  {patente.enteRilascio}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition font-medium">
                  <FileText className="w-5 h-5" />
                  Scarica Copia
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium">
                  <Edit className="w-5 h-5" />
                  Modifica
                </button>
              </div>
            </div>
          </div>
        );
      })}

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
