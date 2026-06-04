import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CalendarClock, Inbox } from "lucide-react";
import { BookingsPageHeader } from "@/components/booking/BookingsPageHeader";
import { BookingFilterPills } from "@/components/booking/BookingFilterPills";
import { MyBookingCard } from "@/components/booking/MyBookingCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useMyBookings } from "@/hooks/useBooking";
import type { BookingStatus as BS } from "@/types/booking";

export function DashboardBookings() {
  const { t } = useTranslation();
  const { bookings, refetch, isLoading } = useMyBookings();

  const TABS: { id: string; label: string; match?: (s: BS) => boolean }[] = [
    { id: "ALL", label: t("bookings.filterAll") },
    { id: "PENDING", label: t("bookings.filterPending"), match: (s) => s === "PENDING" },
    {
      id: "CONFIRMED",
      label: t("bookings.filterConfirmed"),
      match: (s) => s === "CONFIRMED" || s === "PAID" || s === "PAYMENT_PENDING",
    },
    {
      id: "ACTIVE",
      label: t("bookings.filterActive"),
      match: (s) =>
        ["ACTIVE", "PICKUP_SCHEDULED", "IN_TRANSIT", "RETURN_SCHEDULED", "RETURNING"].includes(s),
    },
    { id: "COMPLETED", label: t("bookings.filterCompleted"), match: (s) => s === "COMPLETED" },
    { id: "DISPUTED", label: t("bookings.filterDisputed"), match: (s) => s === "DISPUTED" },
  ];
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
        eyebrow={t("bookings.ownerDashboardEyebrow")}
        title={t("bookings.bookingRequestsTitle")}
        description={t("bookings.bookingRequestsDesc")}
        stats={[
          { label: t("listing.statTotal"), value: ownerList.length, icon: Inbox, tone: "stone" },
          { label: t("bookings.filterPending"), value: pending, icon: CalendarClock, tone: "amber" },
          { label: t("bookings.filterActive"), value: active, icon: Inbox, tone: "green" },
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
            title={t("bookings.noBookingsInCategory")}
            subtitle={
              tab === "ALL"
                ? t("bookings.noBookingsAllHint")
                : t("bookings.noBookingsFilterHint")
            }
          />
          {tab === "ALL" ? (
            <div className="flex justify-center pb-8">
              <Link to="/search" className="btn btn-secondary btn-sm">
                {t("bookings.shareListings")}
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
