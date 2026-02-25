import { useStoreKey } from "@/shared/hooks/useStoreKey";
import type { ContractModel, VehicleModel } from "@/shared/type";
import PolicyDetail from "./PolicyDetail";





export default function Policies() {
  const storedContract = useStoreKey<ContractModel[]>("contracts");
  const storedVehicle = useStoreKey<VehicleModel[]>("vehicle");


  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Le Tue Polizze</h3>
      </div>

      <div className="space-y-4">
        {storedContract && storedVehicle && storedContract.map(
          (contract) => (
            <PolicyDetail key={contract.id} contract={contract} vehicle={storedVehicle.find((vehicle)=> vehicle.id === contract.vehicle_id )} />
          )
        )}
      </div>
    </div>
  );
}
