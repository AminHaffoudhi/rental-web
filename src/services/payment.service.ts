import { api, unwrap } from "@/services/api";
import type { Payment } from "@/types/payment";

export interface StripeConfig {
  enabled: boolean;
  publishableKey: string | null;
  currency: string;
}

export async function getPaymentByBooking(bookingId: string): Promise<Payment> {
  const res = await api.get(`/payments/booking/${bookingId}`);
  return unwrap(res);
}

export async function getStripeConfig(): Promise<StripeConfig> {
  const res = await api.get(`/payments/stripe-config`);
  return unwrap(res);
}

export async function createCheckoutSession(
  bookingId: string
): Promise<{ url: string; sessionId: string }> {
  const res = await api.post(`/payments/checkout/${bookingId}`);
  return unwrap(res);
}
