import { getDaysUntilExpiry } from "@/shared/utils/date";
import { Bike, Car, ChevronRight } from "lucide-react";

const policies = [
  {
    id: 1,
    tipo: "Auto",
    icon: Car,
    targa: "AB123CD",
    veicolo: "Fiat 500 1.2",
    piano: "RC Completa",
    stato: "Attiva",
    scadenza: "2026-08-15",
    premio: "280.00",
    classeBonus: 1,
  },
  {
    id: 2,
    tipo: "Moto",
    icon: Bike,
    targa: "XY789ZW",
    veicolo: "Yamaha MT-07",
    piano: "RC Base",
    stato: "Attiva",
    scadenza: "2026-11-20",
    premio: "180.00",
    classeBonus: 3,
  },
  {
    id: 3,
    tipo: "Auto",
    icon: Car,
    targa: "CD456EF",
    veicolo: "Toyota Yaris Hybrid",
    piano: "RC Kasko",
    stato: "In scadenza",
    scadenza: "2026-02-10",
    premio: "450.00",
    classeBonus: 1,
  },
];



const getStatusColor = (stato: string) => {
  const colors = {
    Attiva: "bg-green-100 text-green-700",
    "In scadenza": "bg-orange-100 text-orange-700",
    Scaduta: "bg-red-100 text-red-700",
    "In lavorazione": "bg-blue-100 text-blue-700",
    Approvato: "bg-green-100 text-green-700",
    Rifiutato: "bg-red-100 text-red-700",
  };
  return colors[stato] || "bg-gray-100 text-gray-700";
};

type PoliciesProps = {
    onActiveTab: (tab: string) => void
}
export default function Policies({onActiveTab}: PoliciesProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Le Tue Polizze</h3>
                <button
                    onClick={() => onActiveTab("policies")}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                    Vedi tutte <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {policies.map((policy) => {
                    const daysLeft = getDaysUntilExpiry(policy.scadenza);
                    const IconComponent = policy.icon;
                    return (
                        <div
                            key={policy.id}
                            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-gray-900">
                                                {policy.veicolo}
                                            </h4>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.stato)}`}
                                            >
                                                {policy.stato}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Targa: {policy.targa} • {policy.piano}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Scadenza:{" "}
                                            {new Date(policy.scadenza).toLocaleDateString("it-IT")}
                                            {daysLeft < 60 && (
                                                <span className="text-orange-600 font-medium">
                                                    {" "}
                                                    ({daysLeft} giorni)
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">
                                        €{policy.premio}
                                    </p>
                                    <p className="text-sm text-gray-500">/anno</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}