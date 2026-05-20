import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarX,
  Clock,
  Package,
  ShieldAlert,
  Tag,
  Wallet,
} from "lucide-react";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { EmptyState } from "@/components/shared/EmptyState";
import { useEquipmentList } from "@/hooks/useEquipment";
import { useMyBookings } from "@/hooks/useBooking";
import * as authService from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/utils/currency";
import { formatDateRange } from "@/utils/dates";
import { cn } from "@/utils/cn";

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  href,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  href?: string;
}) {
  const inner = (
    <div
      className={cn(
        "rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-all duration-200",
        href && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
        <span className="text-xs font-medium text-stone-400">All time</span>
      </div>
      <p className="mb-1 font-display text-3xl font-semibold tabular-nums text-stone-900">{value}</p>
      <p className="text-sm text-stone-500">{label}</p>
    </div>
  );

  return href ? <Link to={href}>{inner}</Link> : inner;
}

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { bookings, isLoading: bookingsLoading } = useMyBookings();
  const { equipment, isLoading: eqLoading } = useEquipmentList({});

  useEffect(() => {
    void authService.getMe().then(setUser).catch(() => {});
  }, [setUser]);

  const listings =
    user === null ? [] : equipment.filter((e) => e.owner.id === user.id);

  const earnings =
    bookings?.asOwner
      .filter((b) => b.status === "COMPLETED")
      .reduce((s, b) => s + b.totalPrice, 0) ?? 0;

  const activeRentals =
    bookings?.asRenter.filter((b) =>
      ["ACTIVE", "PICKUP_SCHEDULED", "IN_TRANSIT", "PAID"].includes(b.status)
    ).length ?? 0;

  const pendingRequests =
    bookings?.asOwner.filter((b) => b.status === "PENDING").length ?? 0;

  const recent =
    bookings?.asOwner
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 5) ?? [];

  const loading = bookingsLoading || eqLoading;

  const greet = greetingForNow();

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
        <h2 className="font-display text-2xl text-stone-900">
          {greet}
          {user ? `, ${user.name}` : ""}{" "}
          <span aria-hidden>👋</span>
        </h2>
        <p className="mt-1 text-sm text-stone-500">Here&apos;s what&apos;s happening with your listings.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total earnings"
          value={formatCurrency(earnings)}
          icon={Wallet}
          iconBg="bg-brand-50"
          iconColor="text-brand-500"
          href="/dashboard/earnings"
        />
        <StatCard
          label="Active rentals"
          value={loading ? "—" : String(activeRentals)}
          icon={Package}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          href="/bookings"
        />
        <StatCard
          label="Pending requests"
          value={loading ? "—" : String(pendingRequests)}
          icon={Clock}
          iconBg="bg-yellow-50"
          iconColor="text-yellow-500"
          href="/dashboard/bookings"
        />
        <StatCard
          label="My listings"
          value={loading ? "—" : String(listings.length)}
          icon={Tag}
          iconBg="bg-green-50"
          iconColor="text-green-500"
          href="/dashboard/listings"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/equipment/new" className="btn btn-primary">
          Add New Listing
        </Link>
        <Link to="/dashboard/bookings" className="btn btn-secondary">
          View Booking Requests
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 className="font-display text-lg text-stone-900">Recent Bookings</h3>
          <Link
            to="/dashboard/bookings"
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            View all →
          </Link>
        </div>
        <div className="p-6">
          {recent.length === 0 && !loading ? (
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
                  <tr className="border-b border-stone-100 bg-stone-50/80 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    <th className="px-4 py-3">Equipment</th>
                    <th className="px-4 py-3">Renter</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-stone-50 transition-colors hover:bg-stone-50/80"
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
                            <div className="h-10 w-10 rounded-md bg-stone-100" />
                          )}
                          <span className="font-medium text-stone-900">{b.equipment.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-stone-600">{b.renter.name}</td>
                      <td className="px-4 py-3 text-stone-500">
                        {formatDateRange(b.startDate, b.endDate)}
                      </td>
                      <td className="px-4 py-3">
                        <BookingStatus status={b.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-display font-semibold text-stone-900">
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
    </div>
  );
}
