import type { VehicleModel } from "@/shared/type";
import { Bike, Car, Truck } from "lucide-react";


type ChoiceVeicleProps = {
    vehicles: VehicleModel[];
    onSelectVehicle: (vehicle: VehicleModel) => void;
    vehicleId: string | undefined;
};

export default function ChoiceVehicle({ vehicleId, vehicles, onSelectVehicle }: ChoiceVeicleProps) {
    console.log(vehicleId);
    return (
        <>
            {vehicles.map(vehicle => (
                <div key={vehicle.id} onClick={() => onSelectVehicle(vehicle)} className={`cursor-pointer border bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden  ${vehicle.id === vehicleId ? "border-blue-500 shadow-lg shadow-blue-500" : "border-gray-200"}`}>
                    {/* Header con gradiente */}
                    <div className={`bg-linear-to-r ${getColor(vehicle.type)} p-4 text-white`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {getIcon(vehicle.type)}
                                <span className="text-sm font-semibold uppercase">{vehicle.type}</span>
                            </div>
                            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                                <span className="text-xs font-semibold">Attiva</span>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                            {vehicle.brand} {vehicle.model}
                        </h3>
                        <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg font-mono font-bold text-sm">
                            {vehicle.license_plate}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

const getIcon = (type: string) => {
    switch (type) {
        case 'moto':
            return <Bike className="w-5 h-5" />;
        case 'autocarro':
            return <Truck className="w-5 h-5" />;
        default:
            return <Car className="w-5 h-5" />;
    }
};

const getColor = (type: string) => {
    switch (type) {
        case 'moto':
            return 'from-purple-500 to-pink-500';
        case 'autocarro':
            return 'from-orange-500 to-red-500';
        default:
            return 'from-blue-600 to-cyan-500';
    }
};