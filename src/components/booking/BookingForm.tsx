import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PLATFORM_FEE_PERCENT } from "@/config/constants";
import type { Equipment } from "@/types/equipment";
import { useLocaleFormat } from "@/hooks/useLocaleFormat";
import { getDaysBetween } from "@/utils/dates";
import { startOfDay } from "date-fns";
import { Headphones, RotateCcw, Shield, Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/authStore";
import { equipmentReviewStats } from "@/utils/reviewStats";

interface BookingFormProps {
  equipment: Equipment;
  onSubmit: (data: {
    startDate: Date;
    endDate: Date;
    notes?: string;
  }) => Promise<void> | void;
  /** Submit while loading */
  isSubmitting?: boolean;
}

function estimateTotals(eq: Equipment, start: Date, end: Date) {
  const s = startOfDay(start);
  const e = startOfDay(end);
  const days = getDaysBetween(s.toISOString(), e.toISOString());
  let rentTotal = eq.dailyRate * days;
  if (eq.weeklyRate !== undefined && eq.weeklyRate !== null && days >= 7) {
    const w = Math.floor(days / 7);
    const r = days % 7;
    rentTotal = Math.min(rentTotal, w * eq.weeklyRate + r * eq.dailyRate);
  }
  const platformFee = (rentTotal * PLATFORM_FEE_PERCENT) / 100;
  const deliveryFee = eq.deliveryFee;
  const deposit = eq.depositAmount;
  const rentalSubtotal = rentTotal + platformFee + deliveryFee;
  return {
    days,
    rentTotal,
    platformFee,
    deliveryFee,
    deposit,
    rentalSubtotal,
    grandTotal: rentalSubtotal + deposit,
  };
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function BookingForm({
  equipment,
  onSubmit,
  isSubmitting = false,
}: BookingFormProps) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocaleFormat();
  const user = useAuthStore((s) => s.user);
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");
  const [notes, setNotes] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const totals = useMemo(() => {
    if (!startStr || !endStr) return null;
    const start = startOfDay(new Date(startStr + "T12:00:00"));
    const end = startOfDay(new Date(endStr + "T12:00:00"));
    if (end <= start) return null;
    return estimateTotals(equipment, start, end);
  }, [equipment, startStr, endStr]);

  const { count: reviewCount, average: avgRating } = equipmentReviewStats(equipment);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setDateError(null);
    if (!startStr || !endStr) {
      setDateError(t("bookings.datesRequired"));
      return;
    }
    const start = startOfDay(new Date(startStr + "T12:00:00"));
    const end = startOfDay(new Date(endStr + "T12:00:00"));
    if (end <= start) {
      setDateError(t("bookings.checkoutAfterCheckin"));
      return;
    }
    await onSubmit({
      startDate: start,
      endDate: end,
      notes: notes.trim() || undefined,
    });
  }

  const minDate = todayISO();
  const unavailable = !equipment.isAvailable;

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-xl shadow-[rgba(120,83,40,0.08)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <p className="font-display text-3xl font-semibold text-stone-900">
            {Math.round(equipment.dailyRate)}{" "}
            <span className="text-lg font-normal text-stone-500">TND</span>
            <span className="text-base font-normal text-stone-500">/{t("equipment.perDay")}</span>
          </p>
        </div>
        {avgRating !== null ? (
          <div className="flex items-center gap-1.5 text-sm text-stone-600">
            <div className="flex gap-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "h-3.5 w-3.5 fill-current",
                    n <= Math.round(avgRating) ? "opacity-100" : "opacity-25"
                  )}
                />
              ))}
            </div>
            <span className="tabular-nums">{avgRating.toFixed(1)}</span>
            <span className="text-stone-400">({reviewCount})</span>
          </div>
        ) : (
          <span className="text-sm text-stone-400">{t("bookings.newListingBadge")}</span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium text-stone-700">{t("bookings.selectDates")}</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="mb-1 block text-xs text-stone-500">{t("bookings.checkIn")}</span>
            <input
              type="date"
              min={minDate}
              value={startStr}
              onChange={(e) => {
                setStartStr(e.target.value);
                setDateError(null);
              }}
              className="input w-full rounded-lg p-3 text-sm"
            />
          </div>
          <div>
            <span className="mb-1 block text-xs text-stone-500">{t("bookings.checkOut")}</span>
            <input
              type="date"
              min={startStr || minDate}
              value={endStr}
              onChange={(e) => {
                setEndStr(e.target.value);
                setDateError(null);
              }}
              className="input w-full rounded-lg p-3 text-sm"
            />
          </div>
        </div>
        {dateError ? <p className="text-sm text-red-600">{dateError}</p> : null}
      </div>

      <AnimatePresence initial={false}>
        {totals ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-3 border-t border-stone-200 pt-6 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>
                  {t("bookings.daysTimesRate", {
                    days: totals.days,
                    rate: Math.round(equipment.dailyRate),
                  })}
                </span>
                <span className="font-medium text-stone-900">
                  {formatCurrency(totals.rentTotal)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{t("equipment.deliveryFee")}</span>
                <span className="font-medium text-stone-900">
                  {formatCurrency(totals.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{t("bookings.platformFeeLabel", { percent: PLATFORM_FEE_PERCENT })}</span>
                <span className="font-medium text-stone-900">
                  {formatCurrency(totals.platformFee)}
                </span>
              </div>
              <div className="my-3 h-px bg-stone-100" />
              <div className="flex justify-between font-semibold text-stone-900">
                <span>{t("bookings.total")}</span>
                <span>{formatCurrency(totals.rentalSubtotal)}</span>
              </div>
              <div className="rounded-lg bg-brand-50/80 px-3 py-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{t("bookings.depositRefundable")}</span>
                  <span className="font-semibold text-stone-800">
                    {formatCurrency(totals.deposit)}
                  </span>
                </div>
                <p className="mt-1 text-stone-500">{t("bookings.depositReturnedHint")}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-6">
        <label htmlFor="booking-notes" className="mb-2 block text-sm font-medium text-stone-700">
          {t("bookings.notesForOwner")}
        </label>
        <textarea
          id="booking-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("bookings.notesPlaceholder")}
          className="input min-h-[88px] resize-y text-sm"
        />
      </div>

      {!user ? (
        <Link
          to="/login"
          state={{ from: { pathname: `/equipment/${equipment.id}` } }}
          className="btn btn-primary btn-lg mt-6 block w-full text-center"
        >
          {t("bookings.loginToBook")}
        </Link>
      ) : (
        <button
          type="submit"
          disabled={unavailable || !totals || isSubmitting}
          className="btn btn-primary btn-lg mt-6 w-full disabled:opacity-50"
        >
          {unavailable
            ? t("equipment.unavailable")
            : isSubmitting
              ? t("bookings.sending")
              : t("bookings.requestBooking")}
        </button>
      )}

      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 shrink-0 text-stone-400" aria-hidden />
          {t("bookings.securePayment")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5 shrink-0 text-stone-400" aria-hidden />
          {t("bookings.freeCancellation")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Headphones className="h-3.5 w-3.5 shrink-0 text-stone-400" aria-hidden />
          {t("footer.support247")}
        </span>
      </p>
    </form>
  );
}
