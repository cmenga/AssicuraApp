import axios from "axios";

interface AccessTokenData {
  access_token: string;
  type: string;
}

export const userApi = axios.create({
  baseURL: "http://localhost:8001/user",
  validateStatus: () => true,
});

userApi.interceptors.request.use(
  (config) => {
    const jwt = sessionStorage.getItem("jwt_access");
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
