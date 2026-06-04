import { api, unwrap } from "@/services/api";
import type { Payment } from "@/types/payment";

export interface StripeConfig {
  enabled: boolean;
  publishableKey: string | null;
  /** ISO code Stripe charges at checkout (e.g. eur). */
  currency: string;
  /** Platform display currency for listings/bookings (tnd). */
  displayCurrency: string;
  /** TND per 1 unit of `currency` (e.g. 3.35 TND = 1 EUR). */
  tndPerCheckoutUnit: number;
}

export async function getPaymentByBooking(bookingId: string): Promise<Payment> {
  const res = await api.get(`/payments/booking/${bookingId}`);
  return unwrap(res);
}

export async function getStripeConfig(): Promise<StripeConfig> {
  const res = await api.get(`/payments/stripe-config`);
  const cfg = unwrap(res) as Partial<StripeConfig> & Pick<StripeConfig, "enabled" | "currency">;
  return {
    enabled: Boolean(cfg.enabled),
    publishableKey: cfg.publishableKey ?? null,
    currency: (cfg.currency ?? "eur").toLowerCase(),
    displayCurrency: (cfg.displayCurrency ?? "tnd").toLowerCase(),
    tndPerCheckoutUnit:
      typeof cfg.tndPerCheckoutUnit === "number" && cfg.tndPerCheckoutUnit > 0
        ? cfg.tndPerCheckoutUnit
        : 3.35,
  };
}

export async function createCheckoutSession(
  bookingId: string
): Promise<{ url: string; sessionId: string }> {
  const res = await api.post(`/payments/checkout/${bookingId}`);
  return unwrap(res);
}

/** Confirms payment after Stripe redirect when the webhook has not run yet. */
export async function verifyCheckoutReturn(
  bookingId: string
): Promise<{ activated: boolean }> {
  const res = await api.post(`/payments/verify/${bookingId}`);
  return unwrap(res);
}
