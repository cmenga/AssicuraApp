import { Plus } from "lucide-react";
import { memo } from "react";


export const HeaderPolicies = memo(() => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Le Tue Polizze</h2>
                <p className="text-gray-600 mt-1">
                    Gestisci tutte le tue assicurazioni
                </p>
            </div>
            <button className="bg-linear-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nuova Polizza
            </button>
        </div>
    );
}); 