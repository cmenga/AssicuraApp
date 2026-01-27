import axios from "axios";
import type { AccessTokenData } from "../type";
import { store } from "../model/store";

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
  store.token.set<AccessTokenData>("access-token", token);

  return token;
}

export function forceLogout() {
  store.dispatch("access-token", () => "")
  store.set<string>("relogged", "Rilogga per completare la modifica della mail.");
  window.location.href = "/auth/login";
}