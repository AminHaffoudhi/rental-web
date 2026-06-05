function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL as string);
export const PLATFORM_FEE_PERCENT = 10;
