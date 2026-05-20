import { api, unwrap } from "@/services/api";
import type { User } from "@/types/user";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "RENTER" | "OWNER" | "BOTH";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
  token: string;
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const res = await api.post(`/auth/register`, data);
  return unwrap(res);
}

export async function login(data: LoginData): Promise<{ user: User; token: string }> {
  const res = await api.post(`/auth/login`, data);
  return unwrap(res);
}

export async function verifyEmailWithCode(
  code: string
): Promise<{ user: User; token: string; message: string }> {
  const res = await api.post(`/auth/verify-email`, { code });
  return unwrap(res);
}

export async function resendVerificationCode(body?: { email: string }): Promise<{ message: string }> {
  const res = await api.post(`/auth/resend-code`, body ?? {});
  return unwrap(res);
}

export async function getMe(): Promise<User> {
  const res = await api.get(`/auth/me`);
  return unwrap(res);
}
