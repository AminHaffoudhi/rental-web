import { differenceInCalendarDays, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { BookingActions } from "@/components/booking/BookingActions";
import { BookingStatus } from "@/components/booking/BookingStatus";
import type { Booking } from "@/types/booking";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency";
import { formatDateRange, getDaysBetween } from "@/utils/dates";
import { UserAvatar } from "@/components/user/UserAvatar";

interface MyBookingCardProps {
  booking: Booking;
  perspective: "renter" | "owner";
  onUpdated: () => Promise<void> | void;
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function HintBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

function RenterHints({ booking }: { booking: Booking }) {
  const { t } = useTranslation();
  const days = getDaysBetween(booking.startDate, booking.endDate);
  const end = parseISO(booking.endDate);
  const daysLeft = differenceInCalendarDays(end, new Date());

  switch (booking.status) {
    case "PAYMENT_PENDING":
      return (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="text-xs text-stone-500">{t("bookingCard.completePayment")}</p>
          <Link
            to={`/bookings/${booking.id}`}
            className="btn btn-primary btn-sm w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            {t("bookingCard.payNow")}
          </Link>
        </div>
      );
    case "PAID":
    case "PICKUP_SCHEDULED":
      return (
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
          <HintBadge className="bg-cyan-500/15 text-cyan-800 dark:text-cyan-300">
            {t("bookingCard.deliveryScheduled")}
          </HintBadge>
          {booking.delivery?.agentName ? (
            <span className="text-stone-500">
              {t("bookingCard.agent")}: {booking.delivery.agentName}
              {booking.delivery.agentPhone ? ` · ${booking.delivery.agentPhone}` : ""}
            </span>
          ) : (
            <span className="text-stone-500">{t("bookingCard.awaitingPickup")}</span>
          )}
        </div>
      );
    case "IN_TRANSIT":
      return (
        <HintBadge className="animate-pulse bg-teal-500/15 text-teal-800 dark:text-teal-300">
          <Truck className="h-3.5 w-3.5" />
          {t("bookingCard.equipmentOnWay")}
        </HintBadge>
      );
    case "ACTIVE":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <HintBadge className="bg-green-500/15 text-green-800 dark:text-green-300">
            {daysLeft >= 0
              ? t("bookingCard.daysLeft", { count: daysLeft })
              : t("bookingCard.endingSoon")}
          </HintBadge>
          <span className="text-xs text-stone-500">
            {days === 1 ? t("bookingCard.dayBooked", { count: days }) : t("bookingCard.daysBooked", { count: days })}
          </span>
        </div>
      );
    case "RETURN_SCHEDULED":
    case "RETURNING":
      return (
        <p className="text-xs text-stone-500">{t("bookingCard.returnScheduledHint")}</p>
      );
    case "INSPECTING":
      return (
        <HintBadge className="bg-slate-500/15 text-slate-800 dark:text-slate-300">
          {t("bookingCard.awaitingInspection")}
        </HintBadge>
      );
    case "COMPLETED":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <HintBadge className="bg-green-500/15 text-green-800 dark:text-green-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("bookingCard.completed")}
          </HintBadge>
          <Link
            to={`/bookings/${booking.id}#review`}
            className="btn btn-secondary btn-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {t("bookingCard.leaveReview")}
          </Link>
        </div>
      );
    case "DISPUTED":
      return (
        <HintBadge className="bg-red-500/15 text-red-800 dark:text-red-300">
          {t("bookingCard.disputeOpen")}
        </HintBadge>
      );
    default:
      return null;
  }
}

export function MyBookingCard({ booking, perspective, onUpdated }: MyBookingCardProps) {
  const { t } = useTranslation();
  const counterparty = perspective === "renter" ? booking.owner : booking.renter;
  const days = getDaysBetween(booking.startDate, booking.endDate);
  const muted =
    booking.status === "REJECTED" ||
    booking.status === "CANCELLED" ||
    booking.status === "REFUNDED";

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border bg-canvas-card shadow-elevated transition-all duration-200",
        "hover:border-stone-300 dark:hover:border-stone-600",
        muted && "opacity-80"
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <Link
          to={`/bookings/${booking.id}`}
          className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-stone-100 sm:aspect-auto sm:h-auto sm:w-36 md:w-44"
        >
          {booking.equipment.images[0] ? (
            <img
              src={booking.equipment.images[0]}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full min-h-[140px] items-center justify-center text-stone-400 sm:min-h-0 sm:h-full">
              <Package className="h-12 w-12 opacity-40" strokeWidth={1.25} aria-hidden />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:bg-gradient-to-r sm:from-black/40" />
          <div className="absolute bottom-3 start-3 end-3 sm:hidden">
            <BookingStatus status={booking.status} />
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden sm:inline-flex">
                  <BookingStatus status={booking.status} />
                </span>
                <span className="font-mono text-[11px] font-medium text-stone-400">
                  {t("bookingCard.bookingId", { id: shortId(booking.id) })}
                </span>
              </div>
              <Link
                to={`/equipment/${booking.equipment.id}`}
                className="block font-display text-lg font-semibold leading-snug text-stone-900 transition-colors hover:text-brand-600"
                onClick={(e) => e.stopPropagation()}
              >
                {booking.equipment.title}
              </Link>
              <p className="flex items-center gap-1.5 text-xs text-brand-600">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{booking.equipment.location}</span>
              </p>
            </div>
            <div className="shrink-0 text-start sm:text-end">
              <p className="font-display text-xl font-semibold tabular-nums text-brand-600">
                {formatCurrency(booking.totalPrice)}
              </p>
              <p className="text-xs text-stone-500">{t("bookingCard.rentalTotal")}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-600">
            <span className="inline-flex items-center gap-2">
              <UserAvatar user={counterparty} size="xs" />
              <span>
                {perspective === "renter" ? (
                  <>
                    <span className="text-stone-500">{t("bookingCard.ownerLabel")} </span>
                    <span className="font-medium text-stone-800">{counterparty.name}</span>
                  </>
                ) : (
                  <>
                    <span className="text-stone-500">{t("bookingCard.renterLabel")} </span>
                    <span className="font-medium text-stone-800">{counterparty.name}</span>
                  </>
                )}
              </span>
            </span>
            <span className="hidden h-4 w-px bg-stone-200 sm:block" aria-hidden />
            <span className="inline-flex items-center gap-1.5 text-stone-500">
              <CalendarDays className="h-4 w-4 shrink-0 text-stone-400" />
              {formatDateRange(booking.startDate, booking.endDate)}
              <span className="text-stone-400">·</span>
              {days}d
            </span>
          </div>

          {perspective === "renter" ? (
            <div className="mt-3">
              <RenterHints booking={booking} />
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
              <BookingActions booking={booking} onUpdated={onUpdated} />
            </div>
            <Link
              to={`/bookings/${booking.id}`}
              className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 rtl:flex-row-reverse"
            >
              {t("bookings.viewDetails")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
