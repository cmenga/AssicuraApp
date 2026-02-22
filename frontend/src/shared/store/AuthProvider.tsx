import { useContext, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authApi } from "../api/http";
import type { ActionResponse } from "../type";
import { store } from "../store";

type AuthProviderProps = {
  children: ReactNode;
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "Questo contesto può essere utilizzato solo allàinterno di AuthProvider",
    );
  }
  return context;
}


async function checkAuthenticated(): Promise<boolean> {
  const response = await authApi.post("/protected");
  if (response.status === 204) {
    return true;
  }
  return false;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


  async function login(formData: FormData): Promise<ActionResponse> {
    const data = Object.fromEntries(formData.entries());
    const response = await authApi.post("/sign-in", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const requestStatus = response.status;
    const detail = response.data.detail;
    if (requestStatus !== 204) {
      return { errors: { user: detail }, success: false };
    }

    setIsAuthenticated(true);
    return { success: true };
  }

  async function checkAuth(oldAttempt: number = 0, maxAttempt: number = 5) {
    let isAuth: boolean = false;
    try {
      isAuth = await checkAuthenticated();
    } catch {
      if (oldAttempt >= maxAttempt) {
        window.location.href = "/unreachable";
        return;
      }
      await new Promise(r => setTimeout(r, 2000))
      await checkAuth(oldAttempt + 1, maxAttempt);
      return;
    }

    if (isAuth) {
      setIsAuthenticated(true);
      return;
    }

    setIsAuthenticated(false);
  }


  async function logout() {
    const response = await authApi.post("/sign-out");
    if (response.status >= 300)
      return;
    store.clear();
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
