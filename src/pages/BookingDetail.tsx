import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  Package,
  Star,
} from "lucide-react";
import { BookingActions } from "@/components/booking/BookingActions";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { BookingTimeline } from "@/components/booking/BookingTimeline";
import { StripePaymentSection } from "@/components/booking/StripePaymentSection";
import { PLATFORM_FEE_PERCENT } from "@/config/constants";
import { useBookingDetail } from "@/hooks/useBooking";
import { ReviewForm } from "@/components/review/ReviewForm";
import { getApiErrorDetail } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { BookingStatus as TB } from "@/types/booking";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency";
import { formatDate, formatDateRange, getDaysBetween } from "@/utils/dates";
import { UserAvatar } from "@/components/user/UserAvatar";

function shortRef(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function statusBanner(status: TB): {
  wrap: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
} {
  switch (status) {
    case "PENDING":
      return {
        wrap: "border-brand-100 bg-brand-50 text-brand-950",
        icon: <Clock className="h-6 w-6 text-brand-600" />,
        title: "Request pending",
        subtitle: "The owner will approve or decline shortly.",
      };
    case "CONFIRMED":
      return {
        wrap: "border-blue-100 bg-blue-50 text-blue-950",
        icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
        title: "Confirmed",
        subtitle: "Complete payment to lock in your rental.",
      };
    case "PAYMENT_PENDING":
      return {
        wrap: "border-amber-100 bg-amber-50 text-amber-950",
        icon: <Clock className="h-6 w-6 text-amber-600" />,
        title: "Pay to start",
        subtitle: "Use the button below — your rental begins right after payment.",
      };
    case "PAID":
      return {
        wrap: "border-emerald-100 bg-emerald-50 text-emerald-950",
        icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
        title: "Paid",
        subtitle: "Owner can start the rental, or it may already be active.",
      };
    case "PICKUP_SCHEDULED":
    case "IN_TRANSIT":
    case "ACTIVE":
      return {
        wrap: "border-green-100 bg-green-50 text-green-950",
        icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
        title: "Rental active",
        subtitle: "Coordinate pickup with the owner. Tap Complete rental when finished.",
      };
    case "RETURN_SCHEDULED":
    case "RETURNING":
    case "INSPECTING":
      return {
        wrap: "border-green-100 bg-green-50 text-green-950",
        icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
        title: "Rental active",
        subtitle: "Tap Complete rental when the equipment is returned.",
      };
    case "COMPLETED":
      return {
        wrap: "border-green-100 bg-green-50 text-green-950",
        icon: <CheckCircle2 className="h-6 w-6 text-green-700" />,
        title: "Completed",
        subtitle: "This rental is closed — thank you for using the platform.",
      };
    case "DISPUTED":
      return {
        wrap: "border-red-100 bg-red-50 text-red-950",
        icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
        title: "Dispute open",
        subtitle: "Our team may reach out for more information.",
      };
    case "REJECTED":
      return {
        wrap: "border-rose-100 bg-rose-50 text-rose-950",
        icon: <AlertTriangle className="h-6 w-6 text-rose-600" />,
        title: "Request declined",
        subtitle: "This booking did not go ahead.",
      };
    case "CANCELLED":
      return {
        wrap: "border-stone-200 bg-stone-100 text-stone-800",
        icon: <AlertTriangle className="h-6 w-6 text-stone-600" />,
        title: "Cancelled",
        subtitle: "This booking was cancelled.",
      };
    case "REFUNDED":
      return {
        wrap: "border-zinc-200 bg-zinc-50 text-zinc-900",
        icon: <CheckCircle2 className="h-6 w-6 text-zinc-600" />,
        title: "Refunded",
        subtitle: "Funds have been returned according to policy.",
      };
    default:
      return {
        wrap: "border-stone-100 bg-stone-50 text-stone-900",
        icon: <Clock className="h-6 w-6 text-stone-600" />,
        title: "Booking",
        subtitle: "Track progress below.",
      };
  }
}

function BookingReviewSection({
  bookingId,
  ownerId,
  equipmentId,
  onReviewSubmitted,
}: {
  bookingId: string;
  ownerId: string;
  equipmentId: string;
  onReviewSubmitted?: () => void;
}) {
  return (
    <div id="review" className="scroll-mt-24 space-y-6">
      <ReviewForm
        variant="booking"
        bookingId={bookingId}
        revieweeId={ownerId}
        equipmentId={equipmentId}
        title="Review the owner"
        description="Share feedback about the host. Visible after admin approval."
        onSuccess={onReviewSubmitted}
      />
      <ReviewForm
        variant="equipment"
        equipmentId={equipmentId}
        title="Review the equipment"
        description="Rate the listing and equipment condition."
        onSuccess={onReviewSubmitted}
      />
    </div>
  );
}

export function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { booking, isLoading, error, refetch } = useBookingDetail(id);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (!payment) return;
    if (payment === "success") {
      toast.success("Payment received — your rental is now active!");
      void refetch();
    } else if (payment === "cancelled") {
      toast("Payment cancelled. You can try again when ready.");
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("payment");
        return next;
      },
      { replace: true }
    );
  }, [searchParams, refetch, setSearchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#review") {
      requestAnimationFrame(() => {
        document.getElementById("review")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [booking?.id]);

  if (!id) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center text-stone-500">
        Missing booking id.
      </div>
    );
  }

  if (isLoading || !booking) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center text-stone-500">
        {error ? error.message : "Loading…"}
      </div>
    );
  }

  const isRenter = user?.id === booking.renter.id;
  const days = getDaysBetween(booking.startDate, booking.endDate);
  const rentExclusive = booking.totalPrice - booking.platformFee - booking.deliveryFee;
  const banner = statusBanner(booking.status);
  const grandTotal = booking.totalPrice + booking.depositAmount;

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <div className="container py-4">
        <nav className="flex flex-wrap items-center gap-1 text-sm text-stone-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand-600">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <Link to="/bookings" className="hover:text-brand-600">
            My Bookings
          </Link>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <span className="font-medium text-stone-700">#{shortRef(booking.id)}</span>
        </nav>
      </div>

      <div className="border-b border-stone-100 bg-stone-50/80">
        <div className="container py-6">
          <div
            className={cn(
              "flex flex-wrap items-start gap-4 rounded-xl border p-4 md:p-5",
              banner.wrap
            )}
          >
            <div className="shrink-0">{banner.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-xl font-semibold md:text-2xl">{banner.title}</h1>
                <BookingStatus status={booking.status} />
              </div>
              <p className="mt-1 text-sm opacity-90">{banner.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-24 sm:w-36">
                  {booking.equipment.images[0] ? (
                    <img
                      src={booking.equipment.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone-300">
                      <Package className="h-16 w-16 opacity-40" strokeWidth={1.25} aria-hidden />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <Link
                    to={`/equipment/${booking.equipment.id}`}
                    className="font-display text-xl font-semibold text-stone-900 hover:text-brand-600"
                  >
                    {booking.equipment.title}
                  </Link>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <span className="inline-flex items-center gap-2 text-stone-600">
                      <UserAvatar user={booking.owner} size="sm" />
                      <span>
                        Owner:{" "}
                        <Link
                          to={`/users/${booking.owner.id}`}
                          className="font-medium text-stone-900 hover:text-brand-600"
                        >
                          {booking.owner.name}
                        </Link>
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2 text-stone-600">
                      <UserAvatar user={booking.renter} size="sm" />
                      <span>
                        Renter:{" "}
                        <Link
                          to={`/users/${booking.renter.id}`}
                          className="font-medium text-stone-900 hover:text-brand-600"
                        >
                          {booking.renter.name}
                        </Link>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-stone-900">Rental period</h3>
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-stone-50 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Start
                  </p>
                  <p className="font-medium text-stone-900">{formatDate(booking.startDate)}</p>
                </div>
                <ArrowRight className="hidden h-5 w-5 text-stone-300 sm:block" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">End</p>
                  <p className="font-medium text-stone-900">{formatDate(booking.endDate)}</p>
                </div>
                <div className="ml-auto flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-stone-600 shadow-sm">
                  <CalendarDays className="h-4 w-4 text-brand-500" />
                  {formatDateRange(booking.startDate, booking.endDate)}
                  <span className="text-stone-400">·</span>
                  {days} day{days === 1 ? "" : "s"}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-stone-900">Price breakdown</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>
                    {days} days · rent subtotal
                  </span>
                  <span className="font-semibold text-stone-900">{formatCurrency(rentExclusive)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery fee</span>
                  <span className="font-semibold text-stone-900">
                    {formatCurrency(booking.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Platform fee ({PLATFORM_FEE_PERCENT}%)</span>
                  <span className="font-semibold text-stone-900">
                    {formatCurrency(booking.platformFee)}
                  </span>
                </div>
                <div className="my-3 h-px bg-stone-100" />
                <div className="flex justify-between font-semibold text-stone-900">
                  <span>Rental total</span>
                  <span>{formatCurrency(booking.totalPrice)}</span>
                </div>
                <div className="rounded-lg bg-brand-50/80 px-3 py-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Deposit (refundable)</span>
                    <span className="font-semibold text-stone-800">
                      {formatCurrency(booking.depositAmount)}
                    </span>
                  </div>
                  <p className="mt-1 text-stone-500">Returned after inspection</p>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-3 text-base font-semibold text-stone-900">
                  <span>Amount due (rent + deposit)</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </section>

            {booking.notes ? (
              <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-stone-900">Notes</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                  {booking.notes}
                </p>
              </section>
            ) : null}

            {booking.status === "PAYMENT_PENDING" && isRenter ? (
              <StripePaymentSection booking={booking} />
            ) : null}

            {booking.status === "COMPLETED" && isRenter ? (
              <BookingReviewSection
                bookingId={booking.id}
                ownerId={booking.owner.id}
                equipmentId={booking.equipment.id}
                onReviewSubmitted={() => void refetch()}
              />
            ) : null}
          </div>

          <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-stone-900">Progress</h3>
              <div className="mt-6">
                <BookingTimeline status={booking.status} />
              </div>
            </section>

            {booking.status !== "PENDING" &&
            booking.status !== "REJECTED" &&
            booking.status !== "CANCELLED" ? (
              <section className="rounded-2xl border border-stone-100 bg-stone-50 p-5 text-sm text-stone-600">
                <p className="font-medium text-stone-800">Pickup & return</p>
                <p className="mt-1">
                  Arrange handoff directly with {isOwner ? "the renter" : "the owner"} at{" "}
                  <span className="font-medium text-stone-900">{booking.equipment.location}</span>.
                  No separate delivery scheduling — one payment starts the rental, one button
                  completes it.
                </p>
              </section>
            ) : null}

            <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-stone-900">Payment</h3>
              <div className="mt-4 space-y-3 text-sm">
                {booking.payment ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-stone-600">Status</span>
                      <span className="badge badge-stone">{booking.payment.status}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Amount</span>
                      <span className="font-semibold text-stone-900">
                        {formatCurrency(booking.payment.amount)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-stone-500">No payment record linked.</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-stone-900">Actions</h3>
              <div className="mt-4">
                <BookingActions booking={booking} onUpdated={() => refetch()} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
