"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

interface AuthContextType {
  session: Awaited<ReturnType<typeof useSession>>["data"];
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending:isLoading } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading: mounted ? isLoading : true }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
