import { CheckCircle } from "lucide-react";
import type { CoverageType } from "./type";


export function CoveragePlan(props: CoverageType) {
    const { popular, description, features, price, title } = props;

    return (<div

        className={`bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition relative ${popular ? 'ring-2 ring-blue-500' : ''
            }`}
    >
        {popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-linear-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Più Scelto
                </span>
            </div>
        )}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-3xl font-bold text-blue-600 mb-6">{price}</div>
        <ul className="space-y-3 mb-8">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                </li>
            ))}
        </ul>
        <button className={`w-full py-3 rounded-xl font-semibold transition ${popular
            ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}>
            Scopri di Più
        </button>
    </div>);
}