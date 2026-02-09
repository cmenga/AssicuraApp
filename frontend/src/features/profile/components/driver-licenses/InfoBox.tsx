import { CheckCircle } from "lucide-react";

export default function InfoBox() {
  return (
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
            Avere la patente registrata ci permette di calcolare preventivi più
            accurati e di inviarti promemoria automatici prima della scadenza.
          </p>
        </div>
      </div>
    </div>
  );
}
