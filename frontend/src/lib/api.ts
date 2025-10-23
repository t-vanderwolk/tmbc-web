"use client";

import axios from "axios";

// ✅ Create an axios instance pointing to your backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true, // so cookies (JWT/session) are sent automatically
});

export default api;

// ✅ Add helpers for managing role cookies (used by useAuth)
export function setRoleCookie(role: string) {
  if (typeof document !== "undefined") {
    document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
}

export function clearRoleCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "role=; Max-Age=0; path=/; SameSite=Lax";
  }
}