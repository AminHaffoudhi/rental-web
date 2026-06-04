import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Inbox } from "lucide-react";
import { BookingsPageHeader } from "@/components/booking/BookingsPageHeader";
import { BookingFilterPills } from "@/components/booking/BookingFilterPills";
import { MyBookingCard } from "@/components/booking/MyBookingCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useMyBookings } from "@/hooks/useBooking";
import type { BookingStatus as BS } from "@/types/booking";

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

  const ownerList = bookings?.asOwner ?? [];

  const rows = useMemo(() => {
    const cfg = TABS.find((t) => t.id === tab);
    if (!cfg?.match) return ownerList;
    return ownerList.filter((b) => cfg.match!(b.status));
  }, [ownerList, tab]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: ownerList.length };
    for (const t of TABS) {
      if (t.match) map[t.id] = ownerList.filter((b) => t.match!(b.status)).length;
    }
    return map;
  }, [ownerList]);

  const pending = ownerList.filter((b) => b.status === "PENDING").length;
  const active = ownerList.filter((b) =>
    ["ACTIVE", "PICKUP_SCHEDULED", "IN_TRANSIT", "PAID"].includes(b.status)
  ).length;

  return (
    <div className="space-y-8">
      <BookingsPageHeader
        eyebrow="Owner dashboard"
        title="Booking requests"
        description="Review, approve, and manage rentals for your equipment."
        stats={[
          { label: "Total", value: ownerList.length, icon: Inbox, tone: "stone" },
          { label: "Pending", value: pending, icon: CalendarClock, tone: "amber" },
          { label: "Active", value: active, icon: Inbox, tone: "green" },
        ]}
      />

      <BookingFilterPills
        tabs={TABS.map((t) => ({
          id: t.id,
          label: t.label,
          count: counts[t.id] ?? 0,
        }))}
        activeId={tab}
        onChange={setTab}
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : rows.length > 0 ? (
        <div className="space-y-4">
          {rows.map((b) => (
            <MyBookingCard
              key={b.id}
              booking={b}
              perspective="owner"
              onUpdated={() => refetch()}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-canvas-card shadow-elevated">
          <EmptyState
            icon={Inbox}
            title="No bookings in this category"
            subtitle={
              tab === "ALL"
                ? "New requests from renters will show up here."
                : "Try another filter to see more bookings."
            }
          />
          {tab === "ALL" ? (
            <div className="flex justify-center pb-8">
              <Link to="/search" className="btn btn-secondary btn-sm">
                Share your listings
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
