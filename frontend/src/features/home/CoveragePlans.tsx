import { CoveragePlan } from "./CoveragePlan";
import type { CoverageType } from "./type";


const coverages: CoverageType[] = [
    {
        title: "RC Auto",
        description: "La responsabilità civile obbligatoria per legge",
        price: "da €180/anno",
        features: ["Copertura danni a terzi", "Massimali elevati", "Validità europea"]
    },
    {
        title: "Furto e Incendio",
        description: "Proteggi il tuo veicolo da furto e danni",
        price: "da €120/anno",
        features: ["Rimborso valore commerciale", "Incendio e eventi naturali", "Atti vandalici"],
        popular: true
    },
    {
        title: "Kasko",
        description: "Massima protezione per ogni situazione",
        price: "da €350/anno",
        features: ["Danni propri", "Collisione", "Cristalli e pneumatici"]
    }
];

export function CoveragePlans() {
    return (<section id="prodotti" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Scegli la Copertura Giusta per Te
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Piani flessibili e personalizzabili per ogni esigenza
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {coverages.map((coverage, index) => (
                    <CoveragePlan key={index} {...coverage} />
                ))}
            </div>
        </div>
    </section>);
}