import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Coins,
  Home,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Shield,
  Star,
  Truck,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { EquipmentDetailGallery } from "@/components/equipment/EquipmentDetailGallery";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReviewCard } from "@/components/user/ReviewCard";
import { UserAvatar } from "@/components/user/UserAvatar";
import { CATEGORY_OPTIONS } from "@/config/categories";
import { useEquipmentDetail } from "@/hooks/useEquipment";
import * as bookingService from "@/services/booking.service";
import { getApiErrorDetail } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { Equipment } from "@/types/equipment";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency";

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50">
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
    <section className="overflow-hidden rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
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
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white shadow-sm">
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
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
  const cat =
    CATEGORY_OPTIONS.find((c) => c.value === equipment.category)?.label ?? equipment.category;
  const listed = format(parseISO(equipment.createdAt), "MMMM yyyy");
  const reviews = equipment.reviews ?? [];
  const avg =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

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
              <span>({reviews.length} reviews)</span>
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
  const reviews = equipment.reviews ?? [];
  const avg =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const since = format(parseISO(owner.createdAt), "MMMM yyyy");

  return (
    <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">Hosted by</h3>
      <div className="mt-4 flex gap-4">
        <UserAvatar user={owner} size="lg" />
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-lg font-semibold text-stone-900">{owner.name}</h4>
          <p className="text-sm text-stone-500">Member since {since}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {avg !== null ? (
              <>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                <span className="font-medium text-stone-700">{avg.toFixed(1)}</span>
                <span className="text-stone-500">({reviews.length} reviews)</span>
              </>
            ) : (
              <span className="text-stone-500">No reviews yet</span>
            )}
          </div>
          {owner.kycStatus === "APPROVED" ? (
            <span className="badge badge-green mt-3 inline-flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              Verified owner
            </span>
          ) : null}
          <Link to={`/profile/${owner.id}`} className="btn btn-secondary btn-sm mt-4 inline-flex">
            View profile
          </Link>
        </div>
      </div>
    </section>
  );
}

function OwnerManagePanel({ equipment }: { equipment: Equipment }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-lg">
      <div className="bg-stone-900 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Your listing</p>
        <p className="mt-1 font-display text-lg font-semibold">Manage from dashboard</p>
      </div>
      <div className="space-y-4 p-5 text-sm text-stone-600">
        <p>
          This is how renters see your listing. Toggle visibility or delete it from{" "}
          <strong className="text-stone-800">My Listings</strong>.
        </p>
        <div
          className={cn(
            "rounded-xl px-3 py-2 text-center text-xs font-semibold",
            equipment.isAvailable ? "bg-green-50 text-green-800" : "bg-stone-100 text-stone-600"
          )}
        >
          {equipment.isAvailable ? "Live in search" : "Hidden from search"}
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

function ReviewsSection({ equipment }: { equipment: Equipment }) {
  const reviews = equipment.reviews ?? [];
  const avg =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  const breakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const r of reviews) {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
    }
    const max = Math.max(...counts, 1);
    return { counts, max };
  }, [reviews]);

  return (
    <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-xl font-semibold text-stone-900">Reviews</h3>
      {reviews.length > 0 && avg !== null ? (
        <div className="mt-6 flex flex-wrap items-end gap-8 border-b border-stone-100 pb-8">
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
            <p className="mt-1 text-sm text-stone-500">{reviews.length} reviews</p>
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
      <div className="mt-6 space-y-4">
        {reviews.length ? (
          reviews.map((r) => <ReviewCard key={r.id} review={r} />)
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            subtitle="Be the first to rent this equipment and leave a review."
          />
        )}
      </div>
    </section>
  );
}

export function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const { equipment, isLoading, error } = useEquipmentDetail(id);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = Boolean(user && equipment && user.id === equipment.owner.id);
  const catSlug =
    equipment &&
    (CATEGORY_OPTIONS.find((c) => c.value === equipment.category)?.label ?? "Equipment");

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
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-stone-50 px-4 text-center">
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
    <div className="min-h-screen overflow-x-hidden bg-stone-50 pb-28 lg:pb-16">
      <div className="border-b border-stone-100 bg-white">
        <nav className="container flex flex-wrap items-center gap-1 py-3 text-sm text-stone-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand-600">
            <Home className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 opacity-40" aria-hidden />
          <Link to={`/search?category=${equipment.category}`} className="hover:text-brand-600">
            {catSlug}
          </Link>
          <ChevronRight className="h-4 w-4 opacity-40" aria-hidden />
          <span className="line-clamp-1 font-medium text-stone-700">{equipment.title}</span>
        </nav>
      </div>

      <div className="container py-8 pb-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="min-w-0 max-w-full flex-1 space-y-6 overflow-hidden">
            <EquipmentDetailGallery equipment={equipment} />
            <EquipmentHeader equipment={equipment} />
            <div className="lg:hidden">
              <PricingCard equipment={equipment} />
            </div>
            <DescriptionBlock text={equipment.description} />
            <section className="overflow-hidden rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
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
            <ReviewsSection equipment={equipment} />
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

      {!isOwner && equipment.isAvailable ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-t border-stone-100 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden">
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
