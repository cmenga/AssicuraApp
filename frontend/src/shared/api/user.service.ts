import axios from "axios";

interface AccessTokenData {
  access_token: string;
  type: string;
}

export const userApi = axios.create({
  baseURL: "http://localhost:8001/user",
  validateStatus: (status: number) => {
    if (status === 401) return false;
    if (status >= 500) return false;
    return true;
  },
});

userApi.interceptors.request.use(
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

userApi.interceptors.response.use(
  (response) => { return response; },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);

function forceLogout() {
  sessionStorage.clear();
  localStorage.removeItem("refresh_token");
  sessionStorage.setItem("relogged", "Rilogga per completare la modifica della mail.")
  window.location.href = "/auth/login";
}
