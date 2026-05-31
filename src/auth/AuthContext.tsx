import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import type { User, SubscriptionTier } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  tier: SubscriptionTier;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAtLeast: (required: SubscriptionTier) => boolean;
}

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  disciple_plus: 1,
  church_leader: 2,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("dcpl_token");
    const storedUser = localStorage.getItem("dcpl_user");
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const persist = (tok: string, u: User) => {
    localStorage.setItem("dcpl_token", tok);
    localStorage.setItem("dcpl_user", JSON.stringify(u));
    setToken(tok);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.auth.login(email, password);
    persist(result.token, result.user as User);
  }, []);

  const register = useCallback(async (email: string, username: string, password: string) => {
    const result = await api.auth.register(email, username, password);
    persist(result.token, result.user as User);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dcpl_token");
    localStorage.removeItem("dcpl_user");
    setToken(null);
    setUser(null);
  }, []);

  const tier: SubscriptionTier = (user?.tier as SubscriptionTier) || "free";

  const isAtLeast = useCallback(
    (required: SubscriptionTier) => TIER_RANK[tier] >= TIER_RANK[required],
    [tier]
  );

  return (
    <AuthContext.Provider value={{ user, token, isLoading, tier, login, register, logout, isAtLeast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
