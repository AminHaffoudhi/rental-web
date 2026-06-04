import { CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import type { Booking } from "@/types/booking";
import { getApiErrorDetail } from "@/services/api";
import * as paymentService from "@/services/payment.service";
import {
  formatCheckoutCurrency,
  tndToCheckoutAmount,
} from "@/utils/stripeCheckout";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";

type BookingStripePayButtonProps = {
  booking: Booking;
  className?: string;
  fullWidth?: boolean;
};

export function BookingStripePayButton({
  booking,
  className,
  fullWidth,
}: BookingStripePayButtonProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [stripeConfig, setStripeConfig] = useState<paymentService.StripeConfig | null>(null);

  const payment = booking.payment;
  const rentalDue = payment?.amount ?? booking.totalPrice;
  const depositDue = payment?.depositAmount ?? booking.depositAmount;
  const totalTnd = rentalDue + depositDue;

  useEffect(() => {
    void paymentService
      .getStripeConfig()
      .then(setStripeConfig)
      .catch(() => setStripeConfig(null));
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

  if (stripeConfig === null) {
    return null;
  }

  if (!stripeConfig.enabled) {
    return (
      <p className={cn("text-sm text-amber-800 dark:text-amber-300", className)}>
        {t("bookings.stripeUnavailable")}
      </p>
    );
  }

  const checkoutTotal =
    stripeConfig.currency.toLowerCase() === stripeConfig.displayCurrency
      ? totalTnd
      : tndToCheckoutAmount(totalTnd, stripeConfig);

  const showConversion =
    stripeConfig.currency.toLowerCase() !== stripeConfig.displayCurrency;

  return (
    <div className={cn("space-y-2", className)}>
      {showConversion ? (
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t("bookings.stripeChargeHint", {
            tnd: formatCurrency(totalTnd),
            checkout: formatCheckoutCurrency(checkoutTotal, stripeConfig.currency),
          })}
        </p>
      ) : null}
      <button
        type="button"
        disabled={loading}
        onClick={() => void payWithStripe()}
        className={cn("btn btn-primary", fullWidth && "w-full")}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {t("bookings.stripeRedirecting")}
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" aria-hidden />
            {t("bookings.payWithStripe")}
          </>
        )}
      </button>
    </div>
  );
}
