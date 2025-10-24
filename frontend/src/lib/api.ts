import axios from "axios";

const api = axios.create({
  // ✅ This MUST point directly to Express backend port 4000
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
});

export default api;

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