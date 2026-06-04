import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Search,
  ShieldAlert,
  Star,
  Tag,
  Wallet,
} from "lucide-react";
import { BookingStatus } from "@/components/booking/BookingStatus";
import {
  BookingsStatusChart,
  BookingsTrendChart,
  CategoryBreakdownChart,
  EarningsBarChart,
  ListingsBreakdownChart,
  MonthChangeBadge,
  TopEquipmentTable,
} from "@/components/dashboard/dashboardCharts";
import { EmptyState } from "@/components/shared/EmptyState";
import { useMyBookings } from "@/hooks/useBooking";
import { useOwnerDashboard } from "@/hooks/useOwnerDashboard";
import * as authService from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { isOwnerRole } from "@/lib/roles";
import { formatCurrency } from "@/utils/currency";
import { formatDateRange } from "@/utils/dates";
import { cn } from "@/utils/cn";

const RENTER_ACTIVE = ["ACTIVE", "PICKUP_SCHEDULED", "IN_TRANSIT", "PAID"];
const RENTER_UPCOMING = [
  "CONFIRMED",
  "PAYMENT_PENDING",
  "PAID",
  "PICKUP_SCHEDULED",
  "IN_TRANSIT",
  "ACTIVE",
];

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconBg,
  iconColor,
  href,
}: {
  label: string;
  value: string;
  subValue?: React.ReactNode;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  href?: string;
}) {
  const inner = (
    <div
      className={cn(
        "rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm transition-all duration-200",
        href && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
        {subValue}
      </div>
      <p className="mb-1 font-display text-3xl font-semibold tabular-nums text-stone-900 dark:text-stone-100">
        {value}
      </p>
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
    </div>
  );

  return href ? <Link to={href}>{inner}</Link> : inner;
}

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { data: dashboard, isLoading: dashLoading, canFetch } = useOwnerDashboard();
  const { bookings, isLoading: bookingsLoading } = useMyBookings();

  useEffect(() => {
    void authService.getMe().then(setUser).catch(() => {});
  }, [setUser]);

  const recentOwner =
    bookings?.asOwner
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 5) ?? [];

  const recentRenter = useMemo(
    () =>
      bookings?.asRenter
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, 5) ?? [],
    [bookings?.asRenter]
  );

  const renterStats = useMemo(() => {
    const list = bookings?.asRenter ?? [];
    return {
      active: list.filter((b) => RENTER_ACTIVE.includes(b.status)).length,
      upcoming: list.filter((b) => RENTER_UPCOMING.includes(b.status)).length,
      pending: list.filter((b) =>
        ["PENDING", "PAYMENT_PENDING", "CONFIRMED"].includes(b.status)
      ).length,
      completed: list.filter((b) => b.status === "COMPLETED").length,
      totalSpent: list
        .filter((b) => ["PAID", "ACTIVE", "COMPLETED"].includes(b.status))
        .reduce((sum, b) => sum + b.totalPrice, 0),
    };
  }, [bookings?.asRenter]);

  const loading = dashLoading || bookingsLoading;
  const greet = greetingForNow();
  const s = dashboard?.summary;
  const isOwner = isOwnerRole(user?.role);

  return (
    <div className="space-y-8">
      {(user?.role === "OWNER" || user?.role === "BOTH") && user?.canList === false ? (
        <div className="mb-2 flex flex-col gap-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
              <ShieldAlert size={20} className="text-yellow-600" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-900">Identity verification required</p>
              <p className="mt-0.5 text-xs text-yellow-700">
                {user.kycStatus === "SUBMITTED"
                  ? "Your document is under review. You'll be notified within 24–48 hours."
                  : "Upload your ID to start listing equipment and earning."}
              </p>
            </div>
          </div>
          {user.kycStatus !== "SUBMITTED" ? (
            <Link
              to="/profile"
              className="btn btn-sm shrink-0 bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Verify Now →
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="mb-2">
        <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
          {greet}
          {user ? `, ${user.name}` : ""}{" "}
          <span aria-hidden>👋</span>
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {canFetch
            ? "Here's how your listings and earnings are performing."
            : "Track your rentals, payments, and booking status in one place."}
        </p>
      </div>

      {canFetch ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Net earnings (all time)"
              value={loading || !s ? "—" : formatCurrency(s.totalEarningsNet)}
              subValue={
                <span className="text-xs font-medium text-stone-400">
                  Gross {loading || !s ? "—" : formatCurrency(s.totalEarningsGross)}
                </span>
              }
              icon={Wallet}
              iconBg="bg-brand-50"
              iconColor="text-brand-500"
              href="/dashboard/earnings"
            />
            <StatCard
              label="This month (net)"
              value={loading || !s ? "—" : formatCurrency(s.earningsThisMonthNet)}
              subValue={
                !loading && s ? <MonthChangeBadge pct={s.monthOverMonthChangePct} /> : null
              }
              icon={DollarSign}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              href="/dashboard/earnings"
            />
            <StatCard
              label="Active rentals"
              value={loading || !s ? "—" : String(s.activeRentals)}
              icon={Package}
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
              href="/dashboard/bookings"
            />
            <StatCard
              label="Pending requests"
              value={loading || !s ? "—" : String(s.pendingRequests)}
              icon={Clock}
              iconBg="bg-yellow-50"
              iconColor="text-yellow-500"
              href="/dashboard/bookings"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="My listings"
              value={loading || !s ? "—" : String(s.totalListings)}
              subValue={
                <span className="text-xs font-medium text-green-600">
                  {loading || !s ? "" : `${s.liveListings} live`}
                </span>
              }
              icon={Tag}
              iconBg="bg-green-50"
              iconColor="text-green-500"
              href="/dashboard/listings"
            />
            <StatCard
              label="Completed rentals"
              value={loading || !s ? "—" : String(s.completedBookings)}
              icon={Package}
              iconBg="bg-stone-100"
              iconColor="text-stone-600"
            />
            <StatCard
              label="Pending payout"
              value={loading || !s ? "—" : formatCurrency(s.pendingPayout)}
              icon={Wallet}
              iconBg="bg-violet-50"
              iconColor="text-violet-600"
              href="/dashboard/earnings"
            />
            <StatCard
              label="Average rating"
              value={loading || !s ? "—" : s.avgRating !== null ? s.avgRating.toFixed(1) : "—"}
              subValue={
                <span className="text-xs font-medium text-stone-400">
                  {loading || !s ? "" : `${s.totalReviews} reviews`}
                </span>
              }
              icon={Star}
              iconBg="bg-amber-50"
              iconColor="text-amber-500"
            />
          </div>

          {dashLoading ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="skeleton h-72 rounded-2xl" />
              <div className="skeleton h-72 rounded-2xl" />
              <div className="skeleton h-72 rounded-2xl lg:col-span-2" />
              <div className="skeleton h-64 rounded-2xl" />
              <div className="skeleton h-64 rounded-2xl" />
            </div>
          ) : dashboard ? (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                <EarningsBarChart months={dashboard.earningsByMonth} />
                <BookingsTrendChart days={dashboard.bookingsTrend} />
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <BookingsStatusChart items={dashboard.bookingsByStatus} />
                <ListingsBreakdownChart breakdown={dashboard.listingsBreakdown} />
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <CategoryBreakdownChart categories={dashboard.equipmentByCategory} />
                <TopEquipmentTable items={dashboard.topEquipment} />
              </div>
            </>
          ) : null}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Active rentals"
              value={loading ? "—" : String(renterStats.active)}
              icon={Package}
              iconBg="bg-blue-50 dark:bg-blue-500/15"
              iconColor="text-blue-500"
              href="/bookings"
            />
            <StatCard
              label="Upcoming"
              value={loading ? "—" : String(renterStats.upcoming)}
              icon={CalendarCheck}
              iconBg="bg-brand-50 dark:bg-brand-500/15"
              iconColor="text-brand-500"
              href="/bookings"
            />
            <StatCard
              label="Awaiting action"
              value={loading ? "—" : String(renterStats.pending)}
              icon={Clock}
              iconBg="bg-yellow-50 dark:bg-yellow-500/15"
              iconColor="text-yellow-600"
              href="/bookings"
            />
            <StatCard
              label="Completed"
              value={loading ? "—" : String(renterStats.completed)}
              icon={CheckCircle2}
              iconBg="bg-emerald-50 dark:bg-emerald-500/15"
              iconColor="text-emerald-600"
              href="/bookings"
            />
          </div>

          {!loading && renterStats.totalSpent > 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Total spent on confirmed rentals:{" "}
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {formatCurrency(renterStats.totalSpent)}
              </span>
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Link to="/search" className="btn btn-primary">
              <Search className="h-4 w-4" aria-hidden />
              Browse equipment
            </Link>
            <Link to="/bookings" className="btn btn-secondary">
              View all bookings
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-sm dark:border-stone-800">
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4 sm:px-6 dark:border-stone-800">
              <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">
                Recent rentals
              </h3>
              <Link
                to="/bookings"
                className="text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                View all →
              </Link>
            </div>
            <div className="p-4 sm:p-6">
              {recentRenter.length === 0 && !bookingsLoading ? (
                <div className="py-12 sm:py-16">
                  <EmptyState
                    icon={CalendarX}
                    title="No rentals yet"
                    subtitle="Find equipment on the marketplace and send your first booking request."
                  />
                  <div className="mt-6 flex justify-center">
                    <Link to="/search" className="btn btn-primary">
                      Browse equipment
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-100/80 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:border-stone-800 dark:bg-stone-800/50">
                        <th className="px-3 py-3 sm:px-4">Equipment</th>
                        <th className="px-3 py-3 sm:px-4">Dates</th>
                        <th className="px-3 py-3 sm:px-4">Status</th>
                        <th className="px-3 py-3 text-right sm:px-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRenter.map((b) => (
                        <tr
                          key={b.id}
                          className="border-b border-stone-200 transition-colors hover:bg-stone-100/80 dark:border-stone-800 dark:hover:bg-stone-800/40"
                        >
                          <td className="px-3 py-3 sm:px-4">
                            <Link
                              to={`/bookings/${b.id}`}
                              className="flex items-center gap-3 font-medium text-stone-900 hover:text-brand-600 dark:text-stone-100"
                            >
                              {b.equipment.images[0] ? (
                                <img
                                  src={b.equipment.images[0]}
                                  alt=""
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-stone-100 dark:bg-stone-800" />
                              )}
                              {b.equipment.title}
                            </Link>
                          </td>
                          <td className="px-3 py-3 text-stone-500 sm:px-4">
                            {formatDateRange(b.startDate, b.endDate)}
                          </td>
                          <td className="px-3 py-3 sm:px-4">
                            <BookingStatus status={b.status} />
                          </td>
                          <td className="px-3 py-3 text-right font-display font-semibold text-stone-900 sm:px-4 dark:text-stone-100">
                            {formatCurrency(b.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-brand-50/40 p-5 sm:p-6 dark:border-stone-800 dark:from-stone-900 dark:to-brand-500/10">
            <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
              Want to list your equipment?
            </h3>
            <p className="mt-1 max-w-lg text-sm text-stone-600 dark:text-stone-400">
              Owners get a public profile, listings, earnings dashboard, and identity verification.
              Contact us if you&apos;d like to upgrade your account to list gear.
            </p>
            <Link to="/contact" className="btn btn-secondary btn-sm mt-4">
              Contact support
            </Link>
          </div>
        </>
      )}

      {isOwner ? (
        <div className="flex flex-wrap gap-3">
          <Link to="/equipment/new" className="btn btn-primary">
            Add New Listing
          </Link>
          <Link to="/dashboard/bookings" className="btn btn-secondary">
            View Booking Requests
          </Link>
        </div>
      ) : null}

      {canFetch ? (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-sm dark:border-stone-800">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-stone-800">
            <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">
              Recent booking requests
            </h3>
            <Link
              to="/dashboard/bookings"
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              View all →
            </Link>
          </div>
          <div className="p-6">
            {recentOwner.length === 0 && !bookingsLoading ? (
              <div className="py-16">
                <EmptyState
                  icon={CalendarX}
                  title="No bookings yet"
                  subtitle="Requests from renters will appear here."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-100/80 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:border-stone-800 dark:bg-stone-800/50">
                      <th className="px-4 py-3">Equipment</th>
                      <th className="px-4 py-3">Renter</th>
                      <th className="px-4 py-3">Dates</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOwner.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-stone-200 transition-colors hover:bg-stone-100/80 dark:border-stone-800 dark:hover:bg-stone-800/40"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {b.equipment.images[0] ? (
                              <img
                                src={b.equipment.images[0]}
                                alt=""
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-stone-100 dark:bg-stone-800" />
                            )}
                            <span className="font-medium text-stone-900 dark:text-stone-100">
                              {b.equipment.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                          {b.renter.name}
                        </td>
                        <td className="px-4 py-3 text-stone-500">{formatDateRange(b.startDate, b.endDate)}</td>
                        <td className="px-4 py-3">
                          <BookingStatus status={b.status} />
                        </td>
                        <td className="px-4 py-3 text-right font-display font-semibold text-stone-900 dark:text-stone-100">
                          {formatCurrency(b.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
