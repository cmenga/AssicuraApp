import { contractApy } from "@/shared/api/http";
import { Modal } from "@/shared/components/Modal";
import type { ContractModel, InsurancePolicyModel, VehicleModel } from "@/shared/type";
import { getDaysUntilExpiry } from "@/shared/utils/date";
import { getVehicleTypeIcon } from "@/shared/utils/icon";
import {  Shield, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

type PolicyDetailProps = {
    contract: ContractModel;
    vehicle: VehicleModel | undefined;
};
export default function PolicyDetail({ contract, vehicle }: PolicyDetailProps) {
    const daysLeft = getDaysUntilExpiry(contract.expired_at);
    const IconComponent = getVehicleTypeIcon(vehicle?.type ?? "auto");
    const policiesModalRef = useRef<HTMLDialogElement | null>(null);
    const [policies, setPolicies] = useState<InsurancePolicyModel[] | null>(null);

    const loadPolicies = useEffectEvent(async () => {
        const response = await contractApy.get(`/policies/${contract.id}`);
        if (response.status == 200) {
            setPolicies(response.data);
        }
    });

    useEffect(() => {
        if (policies) return;
        loadPolicies();
    }, []);

    function handleClose() {
        const current = policiesModalRef.current;
        if (current) current.close();
    }
    function handleOpen() {
        const current = policiesModalRef.current;
        if (current) current.showModal();
    }

    return (
        <>
            <Modal ref={policiesModalRef} onClose={handleClose}>
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                        <h2 className="text-2xl font-bold text-gray-900">Dettagli Polizza</h2>
                        <button
                            onClick={handleClose}
                            type="button"
                            className="cursor-pointer text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="grid gap-6">
                        {policies && policies.map((policy) => <PolicyDetailExtended key={policy.id} policy={policy} />)}
                    </div>
                </div>
            </Modal>
            <div onClick={handleOpen} className="cursor-pointer border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            {IconComponent}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-gray-900">
                                    {vehicle?.brand} • {vehicle?.model}
                                </h4>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium `}
                                >
                                    {new Date(contract.expired_at).getTime() > Date.now() ? "attivo" : "scaduta"}
                                </span>
                            </div>
                            {vehicle && (
                                <p className="text-sm text-gray-600 mb-1">
                                    Targa: {vehicle.license_plate}
                                </p>
                            )}
                            <p className="text-sm text-gray-500">
                                Scadenza:{" "}
                                {new Date(contract.expired_at).toLocaleDateString("it-IT")}
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
                            €{contract.total_price}
                        </p>
                        <p className="text-sm text-gray-500">/anno</p>
                    </div>
                </div>
            </div>
        </>
    );
}


type PolicyDetailExtendedProps = {
    policy: InsurancePolicyModel;
};

function PolicyDetailExtended({ policy }: PolicyDetailExtendedProps) {

    return (
        <div className="bg-linear-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
                {/* Icona */}
                <div className="bg-blue-100 p-3 rounded-xl shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {policy.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        {policy.description}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                            €{policy.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">/anno</span>
                    </div>
                </div>
            </div>
        </div>

    );
}