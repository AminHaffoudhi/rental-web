import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CalendarDays, Inbox, Search, Tag } from "lucide-react";
import { BookingsPageHeader } from "@/components/booking/BookingsPageHeader";
import { BookingFilterPills } from "@/components/booking/BookingFilterPills";
import { MyBookingCard } from "@/components/booking/MyBookingCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useMyBookings } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/authStore";
import { isOwnerRole } from "@/lib/roles";
import type { Booking } from "@/types/booking";
import { cn } from "@/utils/cn";

type MainTab = "renter" | "owner";

function countActive(list: Booking[]) {
  return list.filter((b) =>
    ["ACTIVE", "PICKUP_SCHEDULED", "IN_TRANSIT", "PAID", "PAYMENT_PENDING", "CONFIRMED"].includes(
      b.status
    )
  ).length;
}

export function Bookings() {
  const { t } = useTranslation();
  const { bookings, isLoading, error, refetch } = useMyBookings();
  const role = useAuthStore((s) => s.user?.role);
  const isOwner = isOwnerRole(role);
  const [tab, setTab] = useState<MainTab>("renter");

  const stats = useMemo(() => {
    if (!bookings) return null;
    return {
      renting: bookings.asRenter.length,
      rentingActive: countActive(bookings.asRenter),
      owner: bookings.asOwner.length,
      ownerPending: bookings.asOwner.filter((b) => b.status === "PENDING").length,
    };
  }, [bookings]);

  const list = !isOwner || tab === "renter" ? bookings?.asRenter ?? [] : bookings?.asOwner ?? [];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container max-w-4xl pb-20 pt-8 sm:pt-10 md:pb-16">
        <BookingsPageHeader
          eyebrow={t("bookings.eyebrow")}
          title={t("bookings.title")}
          description={
            isOwner ? t("bookings.subtitleOwner") : t("bookings.subtitleRenter")
          }
          stats={
            stats
              ? isOwner
                ? [
                    {
                      label: t("bookings.imRenting"),
                      value: stats.renting,
                      icon: CalendarDays,
                      tone: "blue" as const,
                    },
                    {
                      label: t("bookings.statActiveRentals"),
                      value: stats.rentingActive,
                      icon: Inbox,
                      tone: "green" as const,
                    },
                    {
                      label: t("bookings.statMyEquipment"),
                      value: stats.owner,
                      icon: Tag,
                      tone: "brand" as const,
                    },
                    {
                      label: t("bookings.statPendingRequests"),
                      value: stats.ownerPending,
                      icon: CalendarDays,
                      tone: "amber" as const,
                    },
                  ]
                : [
                    {
                      label: t("bookings.statTotalBookings"),
                      value: stats.renting,
                      icon: CalendarDays,
                      tone: "blue" as const,
                    },
                    {
                      label: t("bookings.statActiveNow"),
                      value: stats.rentingActive,
                      icon: Inbox,
                      tone: "green" as const,
                    },
                  ]
              : undefined
          }
        />

        {isOwner ? (
          <div className="mt-8 sm:mt-10">
            <BookingFilterPills
              tabs={[
                {
                  id: "renter",
                  label: t("bookings.imRenting"),
                  count: bookings?.asRenter.length ?? 0,
                },
                {
                  id: "owner",
                  label: t("bookings.statMyEquipment"),
                  count: bookings?.asOwner.length ?? 0,
                },
              ]}
              activeId={tab}
              onChange={(id) => setTab(id as MainTab)}
            />
          </div>
        ) : null}

        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-2xl sm:h-36" />
              ))}
            </div>
          ) : error || !bookings ? (
            <div className="rounded-2xl border border-red-200 bg-red-500/10 px-6 py-12 text-center text-red-700 dark:border-red-500/30 dark:text-red-300">
              {error?.message ?? t("bookings.loadError")}
            </div>
          ) : list.length > 0 ? (
            <div className="space-y-4">
              {list.map((b) => (
                <MyBookingCard
                  key={b.id}
                  booking={b}
                  perspective={tab}
                  onUpdated={() => refetch()}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-canvas-card px-4 py-4 shadow-elevated">
              <EmptyState
                icon={CalendarDays}
                title={tab === "renter" ? t("bookings.noRentalsTitle") : t("bookings.noIncomingTitle")}
                subtitle={
                  tab === "renter" ? t("bookings.noRentalsHint") : t("bookings.noIncomingHint")
                }
              />
              <div className="flex justify-center pb-8">
                <Link
                  to={tab === "renter" ? "/search" : "/equipment/new"}
                  className={cn("btn", tab === "renter" ? "btn-primary" : "btn-primary")}
                >
                  {tab === "renter" ? (
                    <>
                      <Search className="h-4 w-4" />
                      {t("bookings.browseCta")}
                    </>
                  ) : (
                    <>
                      <Tag className="h-4 w-4" />
                      {t("bookings.listCta")}
                    </>
                  )}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
