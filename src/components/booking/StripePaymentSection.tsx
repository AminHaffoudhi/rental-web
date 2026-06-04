import { CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Booking } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import { getApiErrorDetail } from "@/services/api";
import * as paymentService from "@/services/payment.service";

interface StripePaymentSectionProps {
  booking: Booking;
}

export function StripePaymentSection({ booking }: StripePaymentSectionProps) {
  const [loading, setLoading] = useState(false);
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null);
  const [currency, setCurrency] = useState("tnd");

  const payment = booking.payment;
  const rentalDue = payment?.amount ?? booking.totalPrice;
  const depositDue = payment?.depositAmount ?? booking.depositAmount;
  const totalDue = rentalDue + depositDue;

  useEffect(() => {
    void paymentService
      .getStripeConfig()
      .then((cfg) => {
        setStripeEnabled(cfg.enabled);
        setCurrency(cfg.currency);
      })
      .catch(() => setStripeEnabled(false));
  }, []);

  async function payWithStripe() {
    setLoading(true);
    try {
      const { url } = await paymentService.createCheckoutSession(booking.id);
      window.location.href = url;
    } catch (e) {
      toast.error(getApiErrorDetail(e).message);
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50/80 to-canvas-card p-6 shadow-elevated dark:border-brand-500/30 dark:from-brand-500/10 dark:to-canvas-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
          <CreditCard className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-stone-900">Pay & start rental</h3>
          <p className="mt-1 text-sm text-stone-600">
            One secure payment — your rental becomes <strong>active</strong> immediately. Coordinate
            pickup with the owner after paying.
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-2 rounded-xl border border-stone-200 bg-canvas-elevated/80 px-4 py-3 text-sm dark:border-stone-600">
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Rental + fees</dt>
          <dd className="font-medium tabular-nums text-stone-900">{formatCurrency(rentalDue)}</dd>
        </div>
        {depositDue > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Security deposit</dt>
            <dd className="font-medium tabular-nums text-stone-900">{formatCurrency(depositDue)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-stone-200 pt-2 dark:border-stone-600">
          <dt className="font-semibold text-stone-800 dark:text-stone-200">Total due now</dt>
          <dd className="font-display text-lg font-semibold tabular-nums text-brand-600">
            {formatCurrency(totalDue)}
          </dd>
        </div>
      </dl>

      {stripeEnabled === false ? (
        <p className="mt-4 text-sm text-amber-800 dark:text-amber-300">
          Online payment is temporarily unavailable. Ask the platform admin to confirm your bank
          transfer.
        </p>
      ) : (
        <>
          <p className="mt-3 text-xs text-stone-500">
            Charged in {currency.toUpperCase()} via Stripe (test mode uses card{" "}
            <span className="font-mono">4242 4242 4242 4242</span>).
          </p>
          <button
            type="button"
            disabled={loading || stripeEnabled !== true}
            onClick={() => void payWithStripe()}
            className="btn btn-primary mt-4 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Redirecting to Stripe…
              </>
            ) : (
              "Pay securely with Stripe"
            )}
          </button>
        </>
      )}
    </section>
  );
}
