import type { StripeConfig } from "@/services/payment.service";

/** TND amount → amount charged in Stripe checkout currency. */
export function tndToCheckoutAmount(tnd: number, config: StripeConfig): number {
  if (config.currency.toLowerCase() === config.displayCurrency) {
    return tnd;
  }
  return tnd / config.tndPerCheckoutUnit;
}

export function formatCheckoutCurrency(amount: number, currencyCode: string): string {
  const code = currencyCode.toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${code}`;
  }
}
