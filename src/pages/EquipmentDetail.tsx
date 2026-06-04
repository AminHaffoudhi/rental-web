import { PLATFORM_NAME } from "@/config/brand";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Coins,
  Home,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Shield,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { EquipmentDetailGallery } from "@/components/equipment/EquipmentDetailGallery";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReviewForm } from "@/components/review/ReviewForm";
import { ReviewCard } from "@/components/user/ReviewCard";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useEquipmentDetail } from "@/hooks/useEquipment";
import { useNotificationHighlight } from "@/hooks/useNotificationHighlight";
import * as bookingService from "@/services/booking.service";
import { getApiErrorDetail } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { Equipment } from "@/types/equipment";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency";
import { equipmentReviewStats } from "@/utils/reviewStats";

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="container py-4">
        <div className="skeleton h-4 w-48 max-w-full" />
      </div>
      <div className="container pb-16">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="skeleton aspect-[16/9] w-full rounded-2xl" />
            <div className="skeleton h-10 w-3/4 max-w-lg rounded-lg" />
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-40 w-full rounded-2xl" />
          </div>
          <div className="skeleton h-[420px] w-full shrink-0 rounded-2xl lg:w-[380px]" />
        </div>
      </div>
    </div>
  );
}

function DescriptionBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 280;
  const shown = long && !open ? `${text.slice(0, 280)}…` : text;

  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm">
      <h3 className="font-display text-xl font-semibold text-stone-900">About this equipment</h3>
      <p className="mt-4 max-w-full whitespace-pre-wrap leading-relaxed text-stone-600 [overflow-wrap:anywhere]">
        {shown}
      </p>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-3 text-sm font-semibold text-brand-600 hover:underline"
        >
          {open ? "Show less" : "Read full description"}
        </button>
      ) : null}
    </section>
  );
}

function PricingCard({ equipment }: { equipment: Equipment }) {
  const rows: {
    icon: typeof Coins;
    label: string;
    value: string;
    sub?: string;
    highlight?: boolean;
  }[] = [
    {
      icon: Coins,
      label: "Daily rate",
      value: `${formatCurrency(equipment.dailyRate)} / day`,
      highlight: true,
    },
    ...(equipment.weeklyRate != null
      ? [
          {
            icon: CalendarDays,
            label: "Weekly rate",
            value: `${formatCurrency(equipment.weeklyRate)} / week`,
          },
        ]
      : []),
    {
      icon: Shield,
      label: "Security deposit",
      value: formatCurrency(equipment.depositAmount),
      sub: "Refunded after return",
    },
    {
      icon: Truck,
      label: "Delivery fee",
      value: formatCurrency(equipment.deliveryFee),
      sub: equipment.deliveryFee > 0 ? "One-way delivery" : "Free delivery",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-canvas-card shadow-sm">
      <div className="border-b border-brand-100/80 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Pricing</p>
        <p className="mt-1 font-display text-3xl font-semibold text-stone-900">
          {formatCurrency(equipment.dailyRate)}
          <span className="text-lg font-normal text-stone-500"> / day</span>
        </p>
      </div>
      <dl className="divide-y divide-brand-100/60 px-5">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex items-center gap-3 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas-card shadow-elevated">
                <Icon className="h-4 w-4 text-brand-600" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm text-stone-500">{row.label}</dt>
                <dd
                  className={cn(
                    "text-sm text-stone-900",
                    row.highlight ? "font-semibold" : "font-medium"
                  )}
                >
                  {row.value}
                  {row.sub ? (
                    <span className="ml-1 font-normal text-stone-400">· {row.sub}</span>
                  ) : null}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

function EquipmentHeader({ equipment }: { equipment: Equipment }) {
  const cat = equipment.category?.name ?? "Equipment";
  const listed = format(parseISO(equipment.createdAt), "MMMM yyyy");
  const { count: reviewCount, average: avg } = equipmentReviewStats(equipment);

  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge badge-brand">{cat}</span>
        <span className={cn("badge", equipment.isAvailable ? "badge-green" : "badge-red")}>
          {equipment.isAvailable ? "Available now" : "Currently unavailable"}
        </span>
      </div>
      <h1 className="mt-3 break-words font-display text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
        {equipment.title}
      </h1>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
          {equipment.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
          Listed {listed}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
          {avg !== null ? (
            <>
              <span className="font-medium text-stone-700">{avg.toFixed(1)}</span>
              <span>({reviewCount} reviews)</span>
            </>
          ) : (
            "No reviews yet"
          )}
        </span>
      </div>
    </header>
  );
}

function OwnerCard({ equipment }: { equipment: Equipment }) {
  const owner = equipment.owner;
  const { count: reviewCount, average: avg } = equipmentReviewStats(equipment);
  const since = owner.createdAt
    ? format(parseISO(owner.createdAt), "MMMM yyyy")
    : "recently";
  const isVerified = owner.kycStatus === "APPROVED";

  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-sm">
      <div className="p-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Hosted by
        </h3>
        <div className="mt-4 flex gap-4 sm:gap-5">
          <div className="shrink-0 rounded-2xl bg-gradient-to-br from-stone-50 to-brand-50/40 p-1 ring-1 ring-stone-100">
            <UserAvatar
              user={owner}
              size="lg"
              className="h-16 w-16 text-lg sm:h-[4.5rem] sm:w-[4.5rem]"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <h4 className="font-display text-lg font-semibold leading-tight text-stone-900">
                {owner.name}
              </h4>
              {isVerified ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-emerald-800 shadow-sm"
                  title={`Identity verified on ${PLATFORM_NAME}`}
                >
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} />
                  Verified owner
                </span>
              ) : null}
            </div>
            <p className="text-sm text-stone-500">Member since {since}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {avg !== null ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-900">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden />
                  <span className="font-semibold tabular-nums">{avg.toFixed(1)}</span>
                  <span className="text-amber-800/80">
                    · {reviewCount} {reviewCount === 1 ? "review" : "reviews"} on this listing
                  </span>
                </span>
              ) : (
                <span className="text-stone-500">No reviews yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 bg-stone-100/70 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          to={`/users/${owner.id}`}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-canvas-card px-4 py-3 text-sm font-semibold text-stone-800 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md"
        >
          View profile
          <ChevronRight
            className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}

function OwnerApprovalBanner({ equipment }: { equipment: Equipment }) {
  if (equipment.approvalStatus === "APPROVED") return null;

  const pending = equipment.approvalStatus === "PENDING";
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-3 text-sm",
        pending
          ? "border-amber-200 bg-amber-50 text-amber-950"
          : "border-red-200 bg-red-50 text-red-950"
      )}
      role="status"
    >
      {pending ? (
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
      )}
      <div>
        <p className="font-semibold">
          {pending ? "Pending admin review" : "Listing was rejected"}
        </p>
        <p className="mt-1 text-[13px] opacity-90">
          {pending
            ? "Renters cannot find this until an admin approves it. You'll get a notification when it's ready."
            : equipment.rejectionNote
              ? equipment.rejectionNote
              : "Update your listing and save to resubmit for review."}
        </p>
      </div>
    </div>
  );
}

function OwnerManagePanel({ equipment }: { equipment: Equipment }) {
  const approved = equipment.approvalStatus === "APPROVED";
  const pending = equipment.approvalStatus === "PENDING";
  const rejected = equipment.approvalStatus === "REJECTED";

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-lg">
      <div className="bg-stone-inv px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Your listing</p>
        <p className="mt-1 font-display text-lg font-semibold">Manage from dashboard</p>
      </div>
      <div className="space-y-4 p-5 text-sm text-stone-600">
        {pending ? (
          <p>Submitted for review. You can preview it here; it won&apos;t appear in search until approved.</p>
        ) : rejected ? (
          <p>
            Edit this listing from <strong className="text-stone-800">My Listings</strong> and save to
            resubmit for review.
          </p>
        ) : (
          <p>
            Toggle visibility or delete from <strong className="text-stone-800">My Listings</strong>.
          </p>
        )}
        <div
          className={cn(
            "rounded-xl px-3 py-2 text-center text-xs font-semibold",
            pending
              ? "bg-amber-50 text-amber-900"
              : rejected
                ? "bg-red-50 text-red-900"
                : equipment.isAvailable
                  ? "bg-green-50 text-green-800"
                  : "bg-stone-100 text-stone-600"
          )}
        >
          {pending
            ? "Pending review"
            : rejected
              ? "Rejected — edit to resubmit"
              : equipment.isAvailable
                ? "Live in search"
                : "Approved — hidden from search"}
        </div>
        <Link
          to="/dashboard/listings"
          className="btn btn-primary flex w-full items-center justify-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden />
          Go to My Listings
        </Link>
      </div>
    </div>
  );
}

function ReviewsSection({
  equipment,
  canReview,
  onReviewSubmitted,
  highlightedReviewId,
}: {
  equipment: Equipment;
  canReview: boolean;
  onReviewSubmitted?: () => void;
  highlightedReviewId?: string | null;
}) {
  const { count: reviewCount, average: avg, approvedReviews } = equipmentReviewStats(equipment);
  const displayReviews = equipment.reviews ?? [];

  const breakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const r of approvedReviews) {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
    }
    const max = Math.max(...counts, 1);
    return { counts, max };
  }, [approvedReviews]);

  return (
    <section className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm">
      <h3 className="font-display text-xl font-semibold text-stone-900">Reviews</h3>
      {reviewCount > 0 && avg !== null ? (
        <div className="mt-6 flex flex-wrap items-end gap-8 border-b border-stone-200 pb-8">
          <div>
            <p className="font-display text-5xl font-semibold text-stone-900">{avg.toFixed(1)}</p>
            <div className="mt-1 flex gap-0.5" aria-hidden>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "h-4 w-4",
                    n <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-stone-200"
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-stone-500">{reviewCount} published reviews</p>
          </div>
          <div className="min-w-[200px] flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const n = breakdown.counts[star - 1];
              const pct = (n / breakdown.max) * 100;
              return (
                <div key={star} className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="w-3 tabular-nums">{star}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-brand-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {canReview ? (
        <div className="mt-6">
          <ReviewForm
            variant="equipment"
            equipmentId={equipment.id}
            title="Review this listing"
            description="Rate the equipment. Your review appears after admin approval."
            onSuccess={onReviewSubmitted}
          />
        </div>
      ) : null}
      <div className="mt-6 space-y-4">
        {displayReviews.length ? (
          displayReviews.map((r) => (
            <div
              key={r.id}
              id={`highlight-${r.id}`}
              className={cn(
                "rounded-2xl transition-shadow duration-300",
                highlightedReviewId === r.id && "ring-2 ring-brand-500 ring-offset-2"
              )}
            >
              <ReviewCard review={r} showStatus />
            </div>
          ))
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            subtitle="Be the first to review this listing."
          />
        )}
      </div>
    </section>
  );
}

export function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const { equipment, isLoading, error, refetch } = useEquipmentDetail(id);
  const highlightedReviewId = useNotificationHighlight(refetch);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = Boolean(user && equipment && user.id === equipment.owner.id);
  const catSlug = equipment?.category?.name ?? "Equipment";
  const catFilterSlug = equipment?.category?.slug;

  async function handleBook(data: { startDate: Date; endDate: Date; notes?: string }) {
    if (!equipment) return;
    setSubmitting(true);
    try {
      await bookingService.createBooking({ equipmentId: equipment.id, ...data });
      toast.success("Booking requested!");
    } catch (e) {
      toast.error(getApiErrorDetail(e).message);
    } finally {
      setSubmitting(false);
    }
  }

  function scrollToBook() {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (isLoading) return <DetailSkeleton />;

  if (!equipment) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-canvas px-4 text-center">
        <p className="font-display text-xl font-semibold text-stone-900">Listing not found</p>
        <p className="mt-2 text-sm text-stone-500">
          {error?.message ?? "This equipment may have been removed."}
        </p>
        <Link to="/search" className="btn btn-primary mt-6">
          Browse equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas pb-28 lg:pb-16">
      <div className="border-b border-stone-200 bg-canvas-card">
        <nav className="container flex flex-wrap items-center gap-1 py-3 text-sm text-stone-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand-600">
            <Home className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 opacity-40" aria-hidden />
          <Link
            to={catFilterSlug ? `/search?category=${encodeURIComponent(catFilterSlug)}` : "/search"}
            className="hover:text-brand-600"
          >
            {catSlug}
          </Link>
          <ChevronRight className="h-4 w-4 opacity-40" aria-hidden />
          <span className="line-clamp-1 font-medium text-stone-700">{equipment.title}</span>
        </nav>
      </div>

      <div className="container py-8 pb-16">
        {isOwner ? (
          <div className="mb-6">
            <OwnerApprovalBanner equipment={equipment} />
          </div>
        ) : null}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="min-w-0 max-w-full flex-1 space-y-6 overflow-hidden">
            <EquipmentDetailGallery equipment={equipment} />
            <EquipmentHeader equipment={equipment} />
            <div className="lg:hidden">
              <PricingCard equipment={equipment} />
            </div>
            <DescriptionBlock text={equipment.description} />
            <section className="overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-stone-900">What&apos;s included</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Equipment as listed & inspected",
                  "Delivery & pickup coordination",
                  "Usage instructions from the owner",
                  "Deposit refunded after return",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50">
                      <Check className="h-3 w-3 text-brand-600" aria-hidden />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </section>
            <OwnerCard equipment={equipment} />
            <ReviewsSection
              equipment={equipment}
              canReview={Boolean(
                user &&
                  !isOwner &&
                  !(equipment.reviews ?? []).some((r) => r.reviewer.id === user.id)
              )}
              onReviewSubmitted={() => void refetch()}
              highlightedReviewId={highlightedReviewId}
            />
          </div>

          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[380px]">
            <div className="hidden lg:block">
              <PricingCard equipment={equipment} />
            </div>
            <div className="mt-6">
              {isOwner ? (
                <OwnerManagePanel equipment={equipment} />
              ) : (
                <div id="booking-form">
                  <BookingForm
                    equipment={equipment}
                    onSubmit={handleBook}
                    isSubmitting={submitting}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {!isOwner && equipment.approvalStatus === "APPROVED" && equipment.isAvailable ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-t border-stone-200 bg-canvas-card/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">From</p>
            <p className="font-display text-xl font-semibold text-stone-900">
              {Math.round(equipment.dailyRate)} TND
              <span className="text-sm font-normal text-stone-500">/day</span>
            </p>
          </div>
          <button type="button" className="btn btn-primary shrink-0" onClick={scrollToBook}>
            Book now →
          </button>
        </div>
      ) : null}
    </div>
  );
}
