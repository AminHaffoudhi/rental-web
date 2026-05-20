import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookingActions } from "@/components/booking/BookingActions";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { useMyBookings } from "@/hooks/useBooking";
import type { BookingStatus as BS } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import { formatDateRange } from "@/utils/dates";
import { cn } from "@/utils/cn";

const TABS: { id: string; label: string; match?: (s: BS) => boolean }[] = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending", match: (s) => s === "PENDING" },
  {
    id: "CONFIRMED",
    label: "Confirmed",
    match: (s) => s === "CONFIRMED" || s === "PAID" || s === "PAYMENT_PENDING",
  },
  {
    id: "ACTIVE",
    label: "Active",
    match: (s) =>
      ["ACTIVE", "PICKUP_SCHEDULED", "IN_TRANSIT", "RETURN_SCHEDULED", "RETURNING"].includes(s),
  },
  { id: "COMPLETED", label: "Completed", match: (s) => s === "COMPLETED" },
  { id: "DISPUTED", label: "Disputed", match: (s) => s === "DISPUTED" },
];

export function DashboardBookings() {
  const { bookings, refetch, isLoading } = useMyBookings();
  const [tab, setTab] = useState("ALL");

  const rows = useMemo(() => {
    const list = bookings?.asOwner ?? [];
    const cfg = TABS.find((t) => t.id === tab);
    if (!cfg?.match) return list;
    return list.filter((b) => cfg.match!(b.status));
  }, [bookings?.asOwner, tab]);

  const counts = useMemo(() => {
    const list = bookings?.asOwner ?? [];
    const map: Record<string, number> = { ALL: list.length };
    for (const t of TABS) {
      if (t.match) map[t.id] = list.filter((b) => t.match!(b.status)).length;
    }
    return map;
  }, [bookings?.asOwner]);

  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl font-semibold text-stone-900">Booking Requests</h2>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-brand-500 text-white shadow-warm"
                : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300"
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                tab === t.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
              )}
            >
              {counts[t.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-stone-500">Loading…</p>
      ) : (
        <div className="space-y-4">
          {rows.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-4 rounded-xl border border-stone-100 bg-white p-5 shadow-sm md:flex-row md:items-center"
            >
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {b.equipment.images[0] ? (
                  <img
                    src={b.equipment.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <Link
                  to={`/equipment/${b.equipment.id}`}
                  className="font-semibold text-stone-900 hover:text-brand-600"
                >
                  {b.equipment.title}
                </Link>
                <p className="text-sm text-stone-600">{b.renter.name}</p>
                <p className="text-sm text-stone-500">
                  {formatDateRange(b.startDate, b.endDate)}
                </p>
                <p className="font-display text-lg font-semibold text-brand-600">
                  {formatCurrency(b.totalPrice)}
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3 md:items-end">
                <BookingStatus status={b.status} />
                <div className="flex flex-wrap justify-end gap-2">
                  <BookingActions booking={b} onUpdated={() => refetch()} />
                  <Link to={`/bookings/${b.id}`} className="btn btn-ghost btn-sm">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {!rows.length ? (
            <p className="rounded-xl border border-dashed border-stone-200 bg-white py-16 text-center text-stone-500">
              No bookings in this category.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
