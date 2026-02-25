import { insurancePolicyApi } from "@/shared/api/http";
import type { InsurancePolicyModel } from "@/shared/type";
import { useEffect, useEffectEvent, useState } from "react";
import PolicyBadge from "./PolicyBadge";


type ChoicePolicyProps = {
    vehicleType: "auto" | "moto" | "autocarro";
    onSelectPolicy: (id: number) => void;
    selectPolicies: number[];
};

export default function ChoicePolicy({ vehicleType, selectPolicies, onSelectPolicy }: ChoicePolicyProps) {
    const [policies, setPolicies] = useState<InsurancePolicyModel[] | null>(null);

    const onLoader = useEffectEvent(async () => {
        const data = await loaderPolicy(vehicleType);
        const rcaBase = data.find(item => item.name.toLowerCase().includes("rca base")); 
        setPolicies(data);
        if (rcaBase) onSelectPolicy(rcaBase.id);
    });

    useEffect(() => {
        if (policies && policies[0].vehicle_type === vehicleType) {
            return;
        }
        onLoader();
    }, [vehicleType]);

    return <div className="grid md:grid-cols-3 gap-6">
        {policies && policies.map((policy) =>
            <PolicyBadge
                isSelected={selectPolicies.find(item => item === policy.id) ? true : false}
                onToggle={() => onSelectPolicy(policy.id)}
                policy={policy}
                key={policy.id} />)
        }
    </div>;
}




async function loaderPolicy(type: "auto" | "moto" | "autocarro"): Promise<InsurancePolicyModel[]> {
    const response = await insurancePolicyApi.get(`/policies/${type}`);
    if (response.status == 200) {
        return response.data;
    }
    return [];
}