"use client";

import { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<void>;
}

// Create a mock session for development
const mockSession: Session = {
  access_token: "mock_token",
  token_type: "bearer",
  expires_in: 3600,
  refresh_token: "mock_refresh",
  user: {
    id: "d0d4c65e-f0c4-4f3a-b1f0-c3c7e3e6b0b0",
    aud: "authenticated",
    email: "dev@example.com",
    role: "authenticated",
    email_confirmed_at: new Date().toISOString(),
    phone: "",
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: {
      provider: "email",
      providers: ["email"],
    },
    user_metadata: {
      full_name: "Development User",
    },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  expires_at: 9999999999,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Provide mock values for development
  const value = {
    user: mockSession.user,
    session: mockSession,
    isLoading: false,
    signIn: async () => ({ data: mockSession, error: null }),
    signUp: async () => ({
      data: { user: mockSession.user, session: mockSession },
      error: null,
    }),
    signOut: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
