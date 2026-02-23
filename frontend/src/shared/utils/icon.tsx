import { Bike, Car, Truck } from "lucide-react";


export const getVehicleTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'moto':
      return <Bike className="w-6 h-6" />;
    case 'autocarro':
      return <Truck className="w-6 h-6" />;
    default:
      return <Car className="w-6 h-6" />;
  }
};