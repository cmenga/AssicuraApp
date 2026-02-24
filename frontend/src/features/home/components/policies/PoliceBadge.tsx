import type { InsurancePoliceModel } from "@/shared/type";
import { CheckCircle, Shield } from "lucide-react";


type PolicyBadgeProps = {
    policy: InsurancePoliceModel;
    isSelected: boolean;
    onToggle: (id: number) => void;
};
export default function PolicyBadge({ policy, isSelected, onToggle }: PolicyBadgeProps) {
    return (
        <div
            onClick={() => onToggle(policy.id)}
            className={`relative bg-white border-2 rounded-xl p-5 cursor-pointer transition-all ${isSelected
                ? 'border-blue-600 shadow-lg bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
        >

            <div className="absolute top-4 right-4">
                <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                        }`}
                >
                    {isSelected && <CheckCircle className="w-5 h-5 text-white" fill="currentColor" />}
                </div>
            </div>

            <div className={`inline-flex p-3 rounded-xl mb-3 ${isSelected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                <Shield className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>

            <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                {policy.name}
            </h3>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {policy.description}
            </p>

            <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                    €{policy.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">/anno</span>
            </div>
        </div>
    );
}
