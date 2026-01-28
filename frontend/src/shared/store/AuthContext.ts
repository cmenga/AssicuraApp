import { createContext } from "react";
import type { ActionResponse } from "../type";


interface Context {
  login: (formData: FormData) => Promise<ActionResponse>;
  isAuthenticated: boolean
}
export const AuthContext = createContext<Context | null>(null);
