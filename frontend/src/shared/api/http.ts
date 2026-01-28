import axios from "axios";

export const driverLicenseApi = axios.create({
  baseURL: "http://localhost:8002/driver-license",
  validateStatus: () => true,
  withCredentials: true
});


export const userApi = axios.create({
  baseURL: "http://localhost:8001/user",
  validateStatus: () => true,
  withCredentials: true
});

export const authApi = axios.create({
  baseURL: "http://localhost:8001/auth",
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

