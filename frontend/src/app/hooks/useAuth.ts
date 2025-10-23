/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api, { clearRoleCookie, setRoleCookie } from "../../lib/api";
import type { Role, User } from "../../types";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

// Initial state
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Fetch current session from backend
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get<{ user: User }>("/api/auth/me");
      const user = response.data.user;
      setState({ user, loading: false, error: null });
      if (user) setRoleCookie(user.role);
    } catch {
      setState({ user: null, loading: false, error: null });
      clearRoleCookie();
    }
  }, []);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  // Login handler
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await api.post<{ token?: string; user: User }>(
          "/api/auth/login",
          { email, password }
        );
        const user = response.data.user;
        setState({ user, loading: false, error: null });
        setRoleCookie(user.role);
        router.push(getRoleDestination(user.role));
      } catch {
        setState({ user: null, loading: false, error: "Invalid credentials" });
      }
    },
    [router]
  );

  // Register handler (invite flow)
  const register = useCallback(
    async (payload: { email: string; password: string; name?: string; inviteCode?: string }) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await api.post<{ token?: string; user: User }>(
          "/api/auth/register",
          payload
        );
        const user = response.data.user;
        setState({ user, loading: false, error: null });
        setRoleCookie(user.role);
        router.push(getRoleDestination(user.role));
      } catch {
        setState({ user: null, loading: false, error: "Registration failed" });
      }
    },
    [router]
  );

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      /* ignore server logout errors */
    } finally {
      clearRoleCookie();
      setState({ user: null, loading: false, error: null });
      router.push("/login");
    }
  }, [router]);

  return {
    ...state,
    login,
    register,
    logout,
    refresh: fetchUser,
  };
}

// Utility to determine role destination
const getRoleDestination = (role: Role) => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "MENTOR":
      return "/mentor";
    default:
      return "/dashboard";
  }
};