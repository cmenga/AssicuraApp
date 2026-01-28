import { useContext, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authApi } from "../api/http";
import type { ActionResponse } from "../type";

type AuthProviderProps = {
    children: ReactNode;
};


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Questo contesto può essere utilizzato solo allàinterno di AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    async function handleLogin(formData: FormData): Promise<ActionResponse> {
        const data = Object.fromEntries(formData.entries());
        const response = await authApi.post("/sign-in", data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const requestStatus = response.status;
        const detail = response.data.detail
        if (requestStatus !== 204) {
            return {message: detail,errors: {user:detail}, success:false}
        }

        setIsAuthenticated(true)
        return {message: "Login avvenuto con successo", success: true}
    };
    

    const contextValues = {
        login: handleLogin,
        isAuthenticated: isAuthenticated
    };

    return (<AuthContext.Provider value={contextValues} >
        {children}
    </AuthContext.Provider>);
}