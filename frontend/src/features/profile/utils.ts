import { driverLicenseApi } from "@/shared/api/http";
import { store } from "@/shared/store";
import type { DriverLicenseModel } from "@/shared/type";

export async function updateDriverLicense() {
  const response = await driverLicenseApi.get("/licenses");
  if (response.status === 200) {
    const newData: DriverLicenseModel[] = response.data.map(
      (element: DriverLicenseModel) => ({ ...element }),
    );
    store.dispatch<DriverLicenseModel[]>("driver-license", (prev = []) => {
      const filteredNew = newData.filter(
        (nd) => !prev.some((p) => p.id === nd.id),
      );
      return [...prev, ...filteredNew];
    });
  }
}