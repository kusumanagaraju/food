"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "User" | "Sub-admin" | "Admin";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for token and user on mount
    const storedToken = localStorage.getItem("cravings_token");
    const storedUser = localStorage.getItem("cravings_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from local storage", error);
        localStorage.removeItem("cravings_token");
        localStorage.removeItem("cravings_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("cravings_token", authToken);
    localStorage.setItem("cravings_user", JSON.stringify(userData));

    // Redirect based on role
    if (userData.role === "Admin") {
      router.push("/admin");
    } else if (userData.role === "Sub-admin") {
      router.push("/sub-admin");
    } else {
      router.push("/");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cravings_token");
    localStorage.removeItem("cravings_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
