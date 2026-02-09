import { Shield, TrendingUp, Activity } from "lucide-react";

const stats = [
  {
    label: "Polizze Attive",
    value: "3",
    icon: Shield,
    color: "blue",
    change: "+1 questo mese",
  },
  {
    label: "Risparmio Totale",
    value: "€1.240",
    icon: TrendingUp,
    color: "green",
    change: "vs mercato",
  },
  {
    label: "Classe Bonus",
    value: "1",
    icon: Activity,
    color: "purple",
    change: "Migliore categoria",
  },
];

export default function Stats() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
          >
            <div
              className={`inline-flex p-3 rounded-xl mb-4 bg-${stat.color}-100 text-${stat.color}-600`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
}
