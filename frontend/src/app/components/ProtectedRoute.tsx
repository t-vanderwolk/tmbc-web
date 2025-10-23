"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { Role, User } from "../../types";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode | ((user: User) => ReactNode);
  allowedRoles?: Role[];
  fallbackPath?: string;
};

// Client-side guard that ensures a user is present before rendering children.
export function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath = "/login",
}: ProtectedRouteProps) {
  const auth = useAuth();
  const user = auth.user;
  const loading = auth.loading;
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace(fallbackPath);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      const redirect = getRoleRedirect(user.role);
      router.replace(redirect);
    }
  }, [user, loading, router, allowedRoles, fallbackPath]);

  if (loading || !user) {
    return <p className="text-charcoal/60">Checking your access...</p>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  if (typeof children === "function") {
    return <>{children(user)}</>;
  }

  return <>{children}</>;
}

const getRoleRedirect = (role: Role) => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "MENTOR":
      return "/mentor";
    default:
      return "/dashboard";
  }
};
