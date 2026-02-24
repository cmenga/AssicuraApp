import { insurancePoliceApi } from "@/shared/api/http";
import type { InsurancePoliceModel } from "@/shared/type";
import { useEffect, useEffectEvent, useState } from "react";
import PolicyBadge from "./PoliceBadge";


type ChoicePoliceProps = {
    vehicleType: "auto" | "moto" | "autocarro";
    onSelectPolice: (id: number) => void;
    selectPolicies: number[];
};

export default function ChoicePolice({ vehicleType, selectPolicies,onSelectPolice }: ChoicePoliceProps) {
    const [policies, setPolicies] = useState<InsurancePoliceModel[] | null>(null);

    const onLoader = useEffectEvent(async () => {
        const data = await loaderPolice(vehicleType);
        setPolicies(data);
    });

    useEffect(() => {
        if (policies && policies[0].vehicle_type === vehicleType) {
            return;
        }
        onLoader();
    },
        [vehicleType]);

    return <div className="grid md:grid-cols-3 gap-6">
        {policies && policies.map((police) =>
            <PolicyBadge
                isSelected={selectPolicies.find(item => item === police.id) ? true : false}
                onToggle={() => onSelectPolice(police.id)}
                policy={police}
                key={police.id} />)
        }
    </div>;
}




async function loaderPolice(type: "auto" | "moto" | "autocarro"): Promise<InsurancePoliceModel[]> {
    const response = await insurancePoliceApi.get(`/policies/${type}`);
    console.log(response);
    if (response.status == 200) {
        return response.data;
    }
    return [];
}