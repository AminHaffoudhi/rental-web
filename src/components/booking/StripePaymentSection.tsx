import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookingStripePayButton } from "@/components/booking/BookingStripePayButton";
import type { Booking } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import * as paymentService from "@/services/payment.service";
import {
  formatCheckoutCurrency,
  tndToCheckoutAmount,
} from "@/utils/stripeCheckout";

interface StripePaymentSectionProps {
  booking: Booking;
}

export function StripePaymentSection({ booking }: StripePaymentSectionProps) {
  const { t } = useTranslation();
  const [stripeConfig, setStripeConfig] = useState<paymentService.StripeConfig | null>(null);

  const payment = booking.payment;
  const rentalDue = payment?.amount ?? booking.totalPrice;
  const depositDue = payment?.depositAmount ?? booking.depositAmount;
  const totalDue = rentalDue + depositDue;

  useEffect(() => {
    void paymentService
      .getStripeConfig()
      .then(setStripeConfig)
      .catch(() => setStripeConfig(null));
  }, []);

  const checkoutTotal =
    stripeConfig && stripeConfig.currency.toLowerCase() !== stripeConfig.displayCurrency
      ? tndToCheckoutAmount(totalDue, stripeConfig)
      : null;

  return (
    <section className="rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50/80 to-canvas-card p-6 shadow-elevated dark:border-brand-500/30 dark:from-brand-500/10 dark:to-canvas-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
          <CreditCard className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
            {t("bookings.payStartTitle")}
          </h3>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {t("bookings.payStartSubtitle")}
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-2 rounded-xl border border-stone-200 bg-canvas-elevated/80 px-4 py-3 text-sm dark:border-stone-600">
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">{t("bookings.payRentalFees")}</dt>
          <dd className="font-medium tabular-nums text-stone-900 dark:text-stone-100">
            {formatCurrency(rentalDue)}
          </dd>
        </div>
        {depositDue > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">{t("bookings.payDeposit")}</dt>
            <dd className="font-medium tabular-nums text-stone-900 dark:text-stone-100">
              {formatCurrency(depositDue)}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-stone-200 pt-2 dark:border-stone-600">
          <dt className="font-semibold text-stone-800 dark:text-stone-200">
            {t("bookings.payTotalDue")}
          </dt>
          <dd className="font-display text-lg font-semibold tabular-nums text-brand-600 dark:text-brand-400">
            {formatCurrency(totalDue)}
          </dd>
        </div>
        {checkoutTotal != null && stripeConfig ? (
          <div className="flex justify-between gap-4 text-xs">
            <dt className="text-stone-500">{t("bookings.payStripeAmount")}</dt>
            <dd className="font-medium tabular-nums text-stone-700 dark:text-stone-300">
              {formatCheckoutCurrency(checkoutTotal, stripeConfig.currency)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4">
        <BookingStripePayButton booking={booking} fullWidth />
      </div>
    </section>
  );
}
