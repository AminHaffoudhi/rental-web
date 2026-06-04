import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
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
  MapPin,
} from "lucide-react";
import { BookingActions, bookingHasSidebarActions } from "@/components/booking/BookingActions";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { BookingTimeline } from "@/components/booking/BookingTimeline";
import { StripePaymentSection } from "@/components/booking/StripePaymentSection";
import { PLATFORM_FEE_PERCENT } from "@/config/constants";
import { useBookingDetail } from "@/hooks/useBooking";
import { ReviewForm } from "@/components/review/ReviewForm";
import { getApiErrorDetail } from "@/services/api";
import * as paymentService from "@/services/payment.service";
import { useAuthStore } from "@/store/authStore";
import type { BookingStatus as TB } from "@/types/booking";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency";
import { formatDate, formatDateRange, getDaysBetween } from "@/utils/dates";
import { UserAvatar } from "@/components/user/UserAvatar";

function shortRef(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function statusBanner(
  status: TB,
  t: TFunction
): {
  wrap: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
} {
  switch (status) {
    case "PENDING":
      return {
        wrap:
          "border-brand-200 bg-brand-50 text-brand-950 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-100",
        icon: <Clock className="h-6 w-6 text-brand-600 dark:text-brand-400" />,
        title: t("bookings.bannerPendingTitle"),
        subtitle: t("bookings.bannerPendingSubtitle"),
      };
    case "CONFIRMED":
      return {
        wrap:
          "border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
        icon: <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
        title: t("bookings.bannerConfirmedTitle"),
        subtitle: t("bookings.bannerConfirmedSubtitle"),
      };
    case "PAYMENT_PENDING":
      return {
        wrap:
          "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
        icon: <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
        title: t("bookings.bannerPaymentTitle"),
        subtitle: t("bookings.bannerPaymentSubtitle"),
      };
    case "PAID":
      return {
        wrap:
          "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100",
        icon: <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
        title: t("bookings.bannerPaidTitle"),
        subtitle: t("bookings.bannerPaidSubtitle"),
      };
    case "PICKUP_SCHEDULED":
    case "IN_TRANSIT":
    case "ACTIVE":
      return {
        wrap:
          "border-green-200 bg-green-50 text-green-950 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-100",
        icon: <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />,
        title: t("bookings.bannerActiveTitle"),
        subtitle: t("bookings.bannerActiveSubtitle"),
      };
    case "RETURN_SCHEDULED":
    case "RETURNING":
    case "INSPECTING":
      return {
        wrap:
          "border-green-200 bg-green-50 text-green-950 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-100",
        icon: <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />,
        title: t("bookings.bannerActiveTitle"),
        subtitle: t("bookings.bannerActiveReturnSubtitle"),
      };
    case "COMPLETED":
      return {
        wrap:
          "border-green-200 bg-green-50 text-green-950 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-100",
        icon: <CheckCircle2 className="h-6 w-6 text-green-700 dark:text-green-400" />,
        title: t("bookings.bannerCompletedTitle"),
        subtitle: t("bookings.bannerCompletedSubtitle"),
      };
    case "DISPUTED":
      return {
        wrap:
          "border-red-200 bg-red-50 text-red-950 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100",
        icon: <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />,
        title: t("bookings.bannerDisputedTitle"),
        subtitle: t("bookings.bannerDisputedSubtitle"),
      };
    case "REJECTED":
      return {
        wrap:
          "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
        icon: <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
        title: t("bookings.bannerRejectedTitle"),
        subtitle: t("bookings.bannerRejectedSubtitle"),
      };
    case "CANCELLED":
      return {
        wrap:
          "border-stone-200 bg-stone-100 text-stone-800 dark:border-stone-600 dark:bg-stone-800/50 dark:text-stone-200",
        icon: <AlertTriangle className="h-6 w-6 text-stone-600 dark:text-stone-400" />,
        title: t("bookings.bannerCancelledTitle"),
        subtitle: t("bookings.bannerCancelledSubtitle"),
      };
    case "REFUNDED":
      return {
        wrap:
          "border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-500/30 dark:bg-zinc-500/10 dark:text-zinc-100",
        icon: <CheckCircle2 className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />,
        title: t("bookings.bannerRefundedTitle"),
        subtitle: t("bookings.bannerRefundedSubtitle"),
      };
    default:
      return {
        wrap:
          "border-stone-200 bg-stone-50 text-stone-900 dark:border-stone-600 dark:bg-stone-800/50 dark:text-stone-100",
        icon: <Clock className="h-6 w-6 text-stone-600 dark:text-stone-400" />,
        title: t("bookings.bannerDefaultTitle"),
        subtitle: t("bookings.bannerDefaultSubtitle"),
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
  const { t } = useTranslation();
  return (
    <div id="review" className="scroll-mt-24 space-y-6">
      <ReviewForm
        variant="booking"
        bookingId={bookingId}
        revieweeId={ownerId}
        equipmentId={equipmentId}
        title={t("bookings.reviewOwnerTitle")}
        description={t("bookings.reviewOwnerDesc")}
        onSuccess={onReviewSubmitted}
      />
      <ReviewForm
        variant="equipment"
        equipmentId={equipmentId}
        title={t("bookings.reviewEquipmentTitle")}
        description={t("bookings.reviewEquipmentDesc")}
        onSuccess={onReviewSubmitted}
      />
    </div>
  );
}

export function BookingDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { booking, isLoading, error, refetch } = useBookingDetail(id);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (!payment || !id) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("payment");
        return next;
      },
      { replace: true }
    );

    if (payment === "success") {
      void (async () => {
        try {
          await paymentService.verifyCheckoutReturn(id);
          toast.success(t("bookings.paymentSuccess"));
        } catch (e) {
          toast.error(getApiErrorDetail(e).message);
        } finally {
          await refetch();
        }
      })();
      return;
    }

    if (payment === "cancelled") {
      toast(t("bookings.paymentCancelled"));
    }
  }, [searchParams, refetch, setSearchParams, id]);

  useEffect(() => {
    if (!booking || !id || !user?.id) return;
    const isParticipant = user.id === booking.renter.id || user.id === booking.owner.id;
    if (!isParticipant || booking.status !== "PAYMENT_PENDING") return;
    if (searchParams.get("payment") === "success") return;

    void paymentService.verifyCheckoutReturn(id).then(
      () => refetch(),
      () => undefined
    );
  }, [booking?.id, booking?.status, booking?.renter.id, booking?.owner.id, id, refetch, searchParams, user?.id]);

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
      <div className="container py-16 text-center text-stone-500">{t("bookings.missingBookingId")}</div>
    );
  }

  if (isLoading || !booking) {
    return (
      <div className="min-h-screen bg-canvas">
        <div className="container max-w-6xl space-y-4 py-10">
          <div className="skeleton h-5 w-48" />
          <div className="skeleton h-28 rounded-2xl" />
          <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
            <div className="skeleton h-64 rounded-2xl" />
            <div className="skeleton h-48 rounded-2xl" />
          </div>
          {error ? (
            <p className="text-center text-red-600 dark:text-red-400">{error.message}</p>
          ) : null}
        </div>
      </div>
    );
  }

  const isRenter = user?.id === booking.renter.id;
  const isOwner = user?.id === booking.owner.id;
  const days = getDaysBetween(booking.startDate, booking.endDate);
  const rentExclusive = booking.totalPrice - booking.platformFee - booking.deliveryFee;
  const banner = statusBanner(booking.status, t);
  const grandTotal = booking.totalPrice + booking.depositAmount;

  const sectionClass =
    "rounded-2xl border border-stone-200 bg-canvas-card p-5 shadow-elevated sm:p-6";

  return (
    <div className="min-h-screen bg-canvas pb-24 lg:pb-16">
      <div className="container max-w-6xl py-4 sm:py-6">
        <nav className="flex flex-wrap items-center gap-1 text-sm text-stone-500">
          <Link
            to="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-brand-600"
          >
            <Home className="h-4 w-4" />
            {t("common.home")}
          </Link>
          <ChevronRight className="h-4 w-4 opacity-50 rtl:rotate-180" />
          <Link to="/bookings" className="transition-colors hover:text-brand-600">
            {t("bookings.title")}
          </Link>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <span className="font-mono font-medium text-stone-600">#{shortRef(booking.id)}</span>
        </nav>
      </div>

      <div className="border-b border-stone-200 bg-canvas-card/80 backdrop-blur-sm">
        <div className="container max-w-6xl py-5 sm:py-6">
          <div
            className={cn(
              "flex flex-wrap items-start gap-4 rounded-2xl border p-4 sm:p-5",
              banner.wrap
            )}
          >
            <div className="shrink-0 rounded-xl bg-white/50 p-2 dark:bg-black/20">{banner.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-xl font-semibold sm:text-2xl">{banner.title}</h1>
                <BookingStatus status={booking.status} />
              </div>
              <p className="mt-1 text-sm opacity-90">{banner.subtitle}</p>
            </div>
            <p className="w-full font-display text-2xl font-semibold tabular-nums text-brand-600 sm:ml-auto sm:w-auto sm:text-right">
              {formatCurrency(booking.totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:gap-10">
          <div className="space-y-6 sm:space-y-8">
            <section className={sectionClass}>
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-28 sm:w-40">
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
                    className="font-display text-xl font-semibold text-stone-900 transition-colors hover:text-brand-600 sm:text-2xl"
                  >
                    {booking.equipment.title}
                  </Link>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-brand-600">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {booking.equipment.location}
                  </p>
                  <div className="flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-6">
                    <span className="inline-flex items-center gap-2 text-stone-600">
                      <UserAvatar user={booking.owner} size="sm" />
                      <span>
                        {t("bookings.ownerLabel")}{" "}
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
                        {t("bookings.renterLabel")}{" "}
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

            <section className={sectionClass}>
              <h3 className="font-display text-lg font-semibold text-stone-900">
                {t("bookings.rentalPeriod")}
              </h3>
              <div className="mt-4 flex flex-col gap-4 rounded-xl border border-stone-200 bg-stone-100/60 p-4 dark:border-stone-600 dark:bg-stone-800/40 sm:flex-row sm:flex-wrap sm:items-center">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    {t("bookings.start")}
                  </p>
                  <p className="font-medium text-stone-900">{formatDate(booking.startDate)}</p>
                </div>
                <ArrowRight className="hidden h-5 w-5 text-stone-300 sm:block" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    {t("bookings.end")}
                  </p>
                  <p className="font-medium text-stone-900">{formatDate(booking.endDate)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-canvas-card px-3 py-1.5 text-sm text-stone-600 shadow-elevated sm:ml-auto">
                  <CalendarDays className="h-4 w-4 text-brand-500" />
                  {formatDateRange(booking.startDate, booking.endDate)}
                  <span className="text-stone-400">·</span>
                  {days === 1 ? t("bookings.dayCount", { count: days }) : t("bookings.daysCount", { count: days })}
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <h3 className="font-display text-lg font-semibold text-stone-900">
                {t("bookings.priceBreakdown")}
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>{t("bookings.daysRentSubtotal", { days })}</span>
                  <span className="font-semibold text-stone-900">{formatCurrency(rentExclusive)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{t("equipment.deliveryFee")}</span>
                  <span className="font-semibold text-stone-900">
                    {formatCurrency(booking.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{t("bookings.platformFee", { percent: PLATFORM_FEE_PERCENT })}</span>
                  <span className="font-semibold text-stone-900">
                    {formatCurrency(booking.platformFee)}
                  </span>
                </div>
                <div className="my-3 h-px bg-stone-200 dark:bg-stone-700" />
                <div className="flex justify-between font-semibold text-stone-900">
                  <span>{t("bookings.rentalTotalLabel")}</span>
                  <span>{formatCurrency(booking.totalPrice)}</span>
                </div>
                <div className="rounded-lg border border-brand-200/60 bg-brand-50/80 px-3 py-2 text-xs text-stone-600 dark:border-brand-500/25 dark:bg-brand-500/10 dark:text-stone-400">
                  <div className="flex justify-between">
                    <span>{t("bookings.depositRefundable")}</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {formatCurrency(booking.depositAmount)}
                    </span>
                  </div>
                  <p className="mt-1 text-stone-500">{t("bookings.depositReturnedHint")}</p>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900 dark:border-stone-700">
                  <span>{t("bookings.amountDue")}</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </section>

            {booking.notes ? (
              <section className={sectionClass}>
                <h3 className="font-display text-lg font-semibold text-stone-900">{t("bookings.notes")}</h3>
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

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:space-y-8">
            <section className={sectionClass}>
              <h3 className="font-display text-lg font-semibold text-stone-900">{t("bookings.progress")}</h3>
              <div className="mt-6">
                <BookingTimeline status={booking.status} />
              </div>
            </section>

            {booking.status !== "PENDING" &&
            booking.status !== "REJECTED" &&
            booking.status !== "CANCELLED" ? (
              <section className="rounded-2xl border border-stone-200 bg-stone-100/60 p-5 text-sm text-stone-600 dark:border-stone-600 dark:bg-stone-800/40 dark:text-stone-400">
                <p className="font-medium text-stone-800 dark:text-stone-200">
                  {t("bookings.pickupReturnTitle")}
                </p>
                <p className="mt-1">
                  {t("bookings.pickupReturnBody", {
                    party: isOwner ? t("bookings.partyRenter") : t("bookings.partyOwner"),
                    location: booking.equipment.location,
                  })}
                </p>
              </section>
            ) : null}

            <section className={sectionClass}>
              <h3 className="font-display text-lg font-semibold text-stone-900">
                {t("bookings.paymentTitle")}
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                {booking.payment ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-stone-600">{t("bookings.paymentStatus")}</span>
                      <span className="badge badge-stone">{booking.payment.status}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>{t("bookings.paymentAmount")}</span>
                      <span className="font-semibold text-stone-900">
                        {formatCurrency(booking.payment.amount)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-stone-500">{t("bookings.noPaymentRecord")}</p>
                )}
              </div>
            </section>

            {bookingHasSidebarActions(booking, user?.id) ? (
              <section className={cn(sectionClass, "hidden lg:block")}>
                <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {t("bookings.actions")}
                </h3>
                <div className="mt-4">
                  <BookingActions booking={booking} onUpdated={() => refetch()} />
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>

      {bookingHasSidebarActions(booking, user?.id) ? (
        <div className="fixed bottom-0 start-0 end-0 z-40 border-t border-stone-200 bg-canvas-card/95 px-4 py-3 shadow-elevated backdrop-blur-md lg:hidden safe-bottom">
          <BookingActions booking={booking} onUpdated={() => refetch()} />
        </div>
      ) : null}
    </div>
  );
}
