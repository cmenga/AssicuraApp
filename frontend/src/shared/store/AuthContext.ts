import { createContext } from "react";
import type { ActionResponse } from "../type";
interface Context {
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  login: (formData: FormData) => Promise<ActionResponse>;
  logout: () => void;
}

export const AuthContext = createContext<Context | null>(null);
