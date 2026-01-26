import axios from "axios";
import type { AccessTokenData } from "../type";
import { forceLogout } from "../utils";

export const driverLicenseApi = axios.create({
  baseURL: "http://localhost:8002/driver-license",
  validateStatus: (status: number) => {
    if (status === 401) return false;
    if (status >= 500) return false;
    return true;
  },
});


driverLicenseApi.interceptors.request.use(
  (config) => {
    const jwt = sessionStorage.getItem("access_token");
    if (jwt) {
      const token: AccessTokenData = JSON.parse(jwt);
      config.headers = config.headers || {};
      config.headers.Authorization = `${token.type} ${token.access_token}`;
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);


driverLicenseApi.interceptors.response.use(
  (response) => { return response; },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);
