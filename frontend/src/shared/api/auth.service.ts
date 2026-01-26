import axios from "axios";
import type { AccessTokenData } from "../type";

export const authApi = axios.create({
  baseURL: "http://localhost:8001/auth",
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});


export async function refreshAccessToken(): Promise<AccessTokenData> {
  const response = await authApi.post("/refresh", {}, { withCredentials: true });
  const token: AccessTokenData = {
    access_token: response.data.access_token,
    type: "Bearer",
  };
  console.log(token)
  sessionStorage.setItem("access_token", JSON.stringify(token));

  return token;
}

export function forceLogout() {
  sessionStorage.clear();
  localStorage.removeItem("refresh_token");
  sessionStorage.setItem("relogged", "Rilogga per completare la modifica della mail.");
  window.location.href = "/auth/login";
}