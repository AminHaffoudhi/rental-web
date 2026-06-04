import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Wallet } from "lucide-react";
import { BookingsPageHeader } from "@/components/booking/BookingsPageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { useMyBookings } from "@/hooks/useBooking";
import type { Booking } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import { formatDateRange } from "@/utils/dates";
type SortKey = "equipment" | "renter" | "period" | "gross" | "fee" | "net" | "status" | "date";

export function DashboardEarnings() {
  const { t } = useTranslation();
  const { bookings, isLoading } = useMyBookings();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const completed = bookings?.asOwner.filter((b) => b.status === "COMPLETED") ?? [];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const totalAll = completed.reduce((s, b) => s + b.totalPrice, 0);
  const totalMonth = completed
    .filter((b) => b.createdAt >= monthStart)
    .reduce((s, b) => s + b.totalPrice, 0);
  const pendingPayout = bookings?.asOwner
    .filter((b) => b.status === "COMPLETED" && b.payment?.status === "PENDING")
    .reduce((s, b) => s + (b.totalPrice - b.platformFee), 0) ?? 0;

  const rows = useMemo(() => {
    const list = [...completed];
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "equipment":
          cmp = a.equipment.title.localeCompare(b.equipment.title);
          break;
        case "renter":
          cmp = a.renter.name.localeCompare(b.renter.name);
          break;
        case "period":
          cmp = a.startDate.localeCompare(b.startDate);
          break;
        case "gross":
          cmp = a.totalPrice - b.totalPrice;
          break;
        case "fee":
          cmp = a.platformFee - b.platformFee;
          break;
        case "net":
          cmp =
            a.totalPrice - a.platformFee - (b.totalPrice - b.platformFee);
          break;
        case "status":
          cmp = (a.payment?.status ?? "").localeCompare(b.payment?.status ?? "");
          break;
        case "date":
          cmp = a.createdAt.localeCompare(b.createdAt);
          break;
        default:
          cmp = 0;
      }
      return cmp * dir;
    });
    return list;
  }, [completed, sortDir, sortKey]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function net(b: Booking) {
    return b.totalPrice - b.platformFee;
  }

  return (
    <div className="space-y-8">
      <BookingsPageHeader
        eyebrow={t("bookings.ownerDashboardEyebrow")}
        title={t("dashboardPage.earningsTitle")}
        description={t("dashboardPage.earningsDesc")}
        stats={[
          {
            label: t("dashboardPage.totalEarned"),
            value: isLoading ? "—" : formatCurrency(totalAll),
            icon: Wallet,
            tone: "brand",
          },
          {
            label: t("dashboardPage.thisMonth"),
            value: isLoading ? "—" : formatCurrency(totalMonth),
            icon: Wallet,
            tone: "green",
          },
          {
            label: t("dashboardPage.pendingPayout"),
            value: isLoading ? "—" : formatCurrency(pendingPayout),
            icon: Wallet,
            tone: "amber",
          },
        ]}
      />

      {!completed.length && !isLoading ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-canvas-card py-16 shadow-elevated">
          <EmptyState
            icon={Wallet}
            title={t("dashboardPage.noEarningsYet")}
            subtitle={t("dashboardPage.noEarningsHint")}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-elevated">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100/80 text-left dark:bg-stone-800/50">
                  {(
                    [
                      ["equipment", t("dashboardPage.tableEquipment")],
                      ["renter", t("dashboardPage.tableRenter")],
                      ["period", t("dashboardPage.tableRentalPeriod")],
                      ["gross", t("dashboardPage.tableGross")],
                      ["fee", t("dashboardPage.tablePlatformFee")],
                      ["net", t("dashboardPage.tableNet")],
                      ["status", t("dashboardPage.tableStatus")],
                      ["date", t("dashboardPage.tableDate")],
                    ] as const
                  ).map(([key, label]) => (
                    <th key={key} className="px-4 py-3">
                      <button
                        type="button"
                        className="text-xs font-semibold uppercase tracking-wide text-stone-500 hover:text-brand-600"
                        onClick={() => toggleSort(key)}
                      >
                        {label}
                        {sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-stone-100 transition-colors hover:bg-stone-100/60 dark:border-stone-800 dark:hover:bg-stone-800/40"
                  >
                    <td className="px-4 py-3 font-medium text-stone-900">{b.equipment.title}</td>
                    <td className="px-4 py-3 text-stone-600">{b.renter.name}</td>
                    <td className="px-4 py-3 text-stone-500">
                      {formatDateRange(b.startDate, b.endDate)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-stone-700">
                      {formatCurrency(b.totalPrice)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-stone-500">
                      {formatCurrency(b.platformFee)}
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums text-brand-600">
                      {formatCurrency(net(b))}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-stone">{b.payment?.status ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
