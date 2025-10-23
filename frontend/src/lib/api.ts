import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const getTokenFromCookies = () => {
  if (typeof document === "undefined") {
    return undefined;
  }

  return document.cookie
    .split(";")
    .map((pair) => pair.trim())
    .find((pair) => pair.startsWith("token="))
    ?.split("=")[1];
};

api.interceptors.request.use((config) => {
  const token = getTokenFromCookies();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${decodeURIComponent(token)}`,
    };
  }

  return config;
});

export const setAuthToken = (token: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}`;
};

export const clearAuthToken = () => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = "token=; path=/; max-age=0";
};

export default api;
