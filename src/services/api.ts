import axios, { type AxiosResponse } from "axios";
import { API_URL } from "@/config/constants";
import type { ApiResponse } from "@/types/api";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      const path = window.location.pathname;
      if (
        !path.startsWith("/login") &&
        !path.startsWith("/register") &&
        !path.startsWith("/verify-email")
      ) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export function unwrap<T>(res: AxiosResponse<ApiResponse<T>>): T {
  const body = res.data;
  if (!body.success) {
    throw new Error("message" in body ? body.message : "Request failed");
  }
  return body.data;
}

/** Parse API / network errors from axios or thrown Error. */
export function getApiErrorDetail(error: unknown): { message: string; code?: string } {
  if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as { message?: unknown; code?: unknown; success?: unknown };
    if (typeof data.message === "string") {
      return {
        message: data.message,
        code: typeof data.code === "string" ? data.code : undefined,
      };
    }
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Something went wrong" };
}
