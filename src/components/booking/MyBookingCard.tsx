import { differenceInCalendarDays, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Package, Truck } from "lucide-react";
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

function RenterHints({ booking }: { booking: Booking }) {
  const days = getDaysBetween(booking.startDate, booking.endDate);
  const end = parseISO(booking.endDate);
  const daysLeft = differenceInCalendarDays(end, new Date());

  switch (booking.status) {
    case "PAYMENT_PENDING":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-stone-500">
            Complete payment via bank transfer — see details for IBAN and reference.
          </p>
          <Link
            to={`/bookings/${booking.id}`}
            className="btn btn-primary btn-sm"
            onClick={(e) => e.stopPropagation()}
          >
            Pay now
          </Link>
        </div>
      );
    case "PAID":
    case "PICKUP_SCHEDULED":
      return (
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
          <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 font-medium text-cyan-800">
            Delivery scheduled
          </span>
          {booking.delivery?.agentName ? (
            <span>
              Agent: {booking.delivery.agentName}
              {booking.delivery.agentPhone ? ` · ${booking.delivery.agentPhone}` : ""}
            </span>
          ) : (
            <span>We’ll notify you when pickup is confirmed.</span>
          )}
        </div>
      );
    case "IN_TRANSIT":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/15 px-2 py-0.5 text-xs font-medium text-teal-800 animate-pulse">
          <Truck className="h-3.5 w-3.5" />
          Equipment on the way
        </span>
      );
    case "ACTIVE":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-800">
            {daysLeft >= 0
              ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in rental`
              : "Rental period ending"}
          </span>
          <span className="text-xs text-stone-500">
            {days} day{days === 1 ? "" : "s"} booked
          </span>
        </div>
      );
    case "RETURN_SCHEDULED":
    case "RETURNING":
      return (
        <p className="text-xs text-stone-500">Return pickup scheduled — see details for timing.</p>
      );
    case "INSPECTING":
      return (
        <span className="rounded-full bg-slate-500/15 px-2 py-0.5 text-xs font-medium text-slate-800">
          Awaiting owner inspection
        </span>
      );
    case "COMPLETED":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Completed
          </span>
          <Link
            to={`/bookings/${booking.id}#review`}
            className="btn btn-secondary btn-sm"
            onClick={(e) => e.stopPropagation()}
          >
            Leave review
          </Link>
        </div>
      );
    case "DISPUTED":
      return (
        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-800">
          Dispute open
        </span>
      );
    default:
      return null;
  }
}

export function MyBookingCard({ booking, perspective, onUpdated }: MyBookingCardProps) {
  const counterparty = perspective === "renter" ? booking.owner : booking.renter;
  const days = getDaysBetween(booking.startDate, booking.endDate);
  const muted =
    booking.status === "REJECTED" ||
    booking.status === "CANCELLED" ||
    booking.status === "REFUNDED";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row md:items-start",
        muted ? "border-stone-200 opacity-75 grayscale-[0.25]" : "border-stone-100"
      )}
    >
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {booking.equipment.images[0] ? (
          <img
            src={booking.equipment.images[0]}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-300">
            <Package className="h-10 w-10 opacity-50" strokeWidth={1.25} aria-hidden />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Link
              to={`/equipment/${booking.equipment.id}`}
              className="font-semibold text-stone-900 hover:text-brand-600"
              onClick={(e) => e.stopPropagation()}
            >
              {booking.equipment.title}
            </Link>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-600">
              <span className="inline-flex items-center gap-1">
                <UserAvatar user={counterparty} size="sm" />
                {perspective === "renter" ? counterparty.name : `Renter: ${counterparty.name}`}
              </span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
              <CalendarDays className="h-4 w-4 shrink-0" />
              {formatDateRange(booking.startDate, booking.endDate)}
              <span className="text-stone-400">·</span>
              <span>
                {days} day{days === 1 ? "" : "s"}
              </span>
            </p>
          </div>
          <div className="text-right">
            <BookingStatus status={booking.status} />
            <p className="font-display mt-2 text-lg font-semibold text-brand-600">
              {formatCurrency(booking.totalPrice)}
            </p>
            <Link
              to={`/bookings/${booking.id}`}
              className="mt-1 inline-block text-xs font-medium text-brand-600 hover:underline"
            >
              #{shortId(booking.id)} · Details
            </Link>
          </div>
        </div>

        {perspective === "renter" ? <RenterHints booking={booking} /> : null}

        <div className="flex flex-wrap gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <BookingActions booking={booking} onUpdated={onUpdated} />
        </div>
      </div>
    </div>
  );
}
