import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    loginContext: (token: string, refreshToken: string) => void;
    logoutContext: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    const loginContext = (token: string, refreshToken: string) => {
        Cookies.set("accessToken", token, { sameSite: "Strict", secure: true });
        Cookies.set("refreshToken", refreshToken, { sameSite: "Strict", secure: true });
        setIsAuthenticated(true);
    };

    const logoutContext = () => {
        Cookies.remove("accessToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, loginContext, logoutContext }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
