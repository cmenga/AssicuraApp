import axios from "axios";

export const driverLicenseApi = axios.create({
  baseURL: "http://localhost:8002/v1/driver-license",
  validateStatus: () => true,
  withCredentials: true,
});

export const userApi = axios.create({
  baseURL: "http://localhost:8001/v1/user",
  validateStatus: () => true,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: "http://localhost:8001/v1/auth",
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


export const vehicleApi = axios.create({
  baseURL: "http://localhost:8003/v1/vehicle",
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});


export const insurancePoliceApi = axios.create({
  baseURL: "http://localhost:8003/v1/insurance",
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});