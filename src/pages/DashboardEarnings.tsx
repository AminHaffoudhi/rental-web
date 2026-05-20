import { useMemo, useState } from "react";
import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useMyBookings } from "@/hooks/useBooking";
import type { Booking } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import { formatDateRange } from "@/utils/dates";
import { cn } from "@/utils/cn";

type SortKey = "equipment" | "renter" | "period" | "gross" | "fee" | "net" | "status" | "date";

export function DashboardEarnings() {
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
      <h2 className="font-display text-2xl font-semibold text-stone-900">Earnings</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-brand-50 p-6">
          <p className="text-sm text-stone-600">Total earned</p>
          <p className="font-display mt-2 text-2xl font-semibold text-stone-900">
            {isLoading ? "—" : formatCurrency(totalAll)}
          </p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-6">
          <p className="text-sm text-stone-600">This month</p>
          <p className="font-display mt-2 text-2xl font-semibold text-stone-900">
            {isLoading ? "—" : formatCurrency(totalMonth)}
          </p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-6">
          <p className="text-sm text-stone-600">Pending payout</p>
          <p className="font-display mt-2 text-2xl font-semibold text-stone-900">
            {isLoading ? "—" : formatCurrency(pendingPayout)}
          </p>
        </div>
      </div>

      {!completed.length && !isLoading ? (
        <div className="py-16">
          <EmptyState
            icon={Wallet}
            title="No earnings yet"
            subtitle="Completed rentals will show up here with net amounts after fees."
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left">
                  {(
                    [
                      ["equipment", "Equipment"],
                      ["renter", "Renter"],
                      ["period", "Rental period"],
                      ["gross", "Gross"],
                      ["fee", "Platform fee"],
                      ["net", "Net"],
                      ["status", "Status"],
                      ["date", "Date"],
                    ] as const
                  ).map(([key, label]) => (
                    <th key={key} className="px-4 py-3 font-semibold text-stone-700">
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-1 hover:text-brand-600",
                          sortKey === key && "text-brand-600"
                        )}
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
                  <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50/80">
                    <td className="px-4 py-3 font-medium">{b.equipment.title}</td>
                    <td className="px-4 py-3 text-stone-600">{b.renter.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-stone-600">
                      {formatDateRange(b.startDate, b.endDate)}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(b.totalPrice)}</td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatCurrency(b.platformFee)}
                    </td>
                    <td className="px-4 py-3 font-display font-semibold">{formatCurrency(net(b))}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-yellow">
                        {b.payment?.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {b.createdAt.slice(0, 10)}
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
