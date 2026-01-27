import { driverLicenseApi } from "@/shared/api/driver-license.service";
import { userApi } from "@/shared/api/user.service";
import { storeFetch, storeFetchThrow } from "@/shared/store";
import type { AddressModel, DriverLicenseModel, UserModel } from "@/shared/type";


export async function profilePageLoader() {
  await storeFetchThrow<UserModel>("user", userApi, "/me");
  await storeFetchThrow<AddressModel[]>("address", userApi, "/addresses");
  await storeFetch<DriverLicenseModel[]>("driver-license", driverLicenseApi, "/licenses");
}

export async function homePageLoader() {
  await storeFetchThrow<UserModel>("user", userApi, "/me")  
}