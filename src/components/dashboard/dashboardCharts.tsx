import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TrendingDown, TrendingUp } from "lucide-react";
import type {
  OwnerBookingsTrendDay,
  OwnerDashboardData,
  OwnerEarningsMonth,
} from "@/types/ownerDashboard";
import type { BookingStatus } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";

const STATUS_META: Record<
  string,
  { label: string; color: string; order: number }
> = {
  PENDING: { label: "Pending", color: "#f59e0b", order: 1 },
  CONFIRMED: { label: "Confirmed", color: "#3b82f6", order: 2 },
  PAID: { label: "Paid", color: "#6366f1", order: 3 },
  ACTIVE: { label: "Active", color: "#22c55e", order: 4 },
  COMPLETED: { label: "Completed", color: "#10b981", order: 5 },
  REJECTED: { label: "Rejected", color: "#ef4444", order: 6 },
  CANCELLED: { label: "Cancelled", color: "#a8a29e", order: 7 },
  DISPUTED: { label: "Disputed", color: "#dc2626", order: 8 },
};

function statusLabel(status: BookingStatus | string, t: (key: string) => string): string {
  const key = `bookingStatus.${status}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return STATUS_META[status]?.label ?? status.replace(/_/g, " ").toLowerCase();
}

function statusColor(status: BookingStatus | string): string {
  return STATUS_META[status]?.color ?? "#78716c";
}

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-sm",
        className
      )}
    >
      <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
        <h3 className="font-display text-lg font-semibold text-stone-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function EarningsBarChart({ months }: { months: OwnerEarningsMonth[] }) {
  const { t } = useTranslation();
  const max = Math.max(...months.map((m) => m.net), 1);

  return (
    <ChartCard title={t("charts.earningsTrend")} subtitle={t("charts.earningsSubtitle")}>
      {months.every((m) => m.net === 0) ? (
        <p className="py-8 text-center text-sm text-stone-500">{t("charts.noEarnings")}</p>
      ) : (
        <div className="flex h-52 items-end justify-between gap-2 sm:gap-3">
          {months.map((m) => {
            const pct = Math.max((m.net / max) * 100, m.net > 0 ? 8 : 0);
            return (
              <div key={m.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold tabular-nums text-brand-600 sm:text-xs">
                  {m.net > 0 ? formatCurrency(m.net) : "—"}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-500"
                    style={{ height: `${pct}%`, minHeight: m.net > 0 ? "0.5rem" : 0 }}
                    title={`${m.label}: ${formatCurrency(m.net)} (${m.bookings} bookings)`}
                  />
                </div>
                <span className="text-[10px] font-medium text-stone-500 sm:text-xs">{m.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </ChartCard>
  );
}

export function BookingsTrendChart({ days }: { days: OwnerBookingsTrendDay[] }) {
  const { t } = useTranslation();
  const max = Math.max(...days.map((d) => d.count), 1);
  const w = 100;
  const h = 48;
  const step = days.length > 1 ? w / (days.length - 1) : w;

  const points = days
    .map((d, i) => {
      const x = i * step;
      const y = h - (d.count / max) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  const last7 = days.slice(-7);
  const totalLast7 = last7.reduce((s, d) => s + d.count, 0);

  return (
    <ChartCard
      title={t("charts.bookingActivity")}
      subtitle={t("charts.requestsLast7", { count: totalLast7 })}
    >
      <div className="relative">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-32 w-full text-brand-500"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(249 115 22 / 0.35)" />
              <stop offset="100%" stopColor="rgb(249 115 22 / 0)" />
            </linearGradient>
          </defs>
          {points ? (
            <>
              <polygon
                fill="url(#trendFill)"
                points={`0,${h} ${points} ${w},${h}`}
              />
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                points={points}
              />
            </>
          ) : null}
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-stone-400 sm:text-xs">
          <span>{days[0]?.label}</span>
          <span>{days[Math.floor(days.length / 2)]?.label}</span>
          <span>{days[days.length - 1]?.label}</span>
        </div>
      </div>
    </ChartCard>
  );
}

export function BookingsStatusChart({
  items,
}: {
  items: { status: BookingStatus; count: number }[];
}) {
  const { t } = useTranslation();
  const sorted = [...items]
    .filter((i) => i.count > 0)
    .sort(
      (a, b) =>
        (STATUS_META[a.status]?.order ?? 99) - (STATUS_META[b.status]?.order ?? 99)
    );
  const total = sorted.reduce((s, i) => s + i.count, 0);

  if (total === 0) {
    return (
      <ChartCard title={t("charts.byStatus")} subtitle={t("charts.allTimeBreakdown")}>
        <p className="py-8 text-center text-sm text-stone-500">{t("charts.noBookingsChart")}</p>
      </ChartCard>
    );
  }

  let offset = 0;
  const segments = sorted.map((item) => {
    const pct = (item.count / total) * 100;
    const seg = { ...item, pct, offset };
    offset += pct;
    return seg;
  });

  const gradient = segments
    .map((s) => `${statusColor(s.status)} ${s.offset}% ${s.offset + s.pct}%`)
    .join(", ");

  return (
    <ChartCard
      title={t("charts.byStatus")}
      subtitle={t("charts.totalBookingsCount", { count: total })}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div
          className="mx-auto h-36 w-36 shrink-0 rounded-full sm:mx-0"
          style={{ background: `conic-gradient(${gradient})` }}
          role="img"
          aria-label="Booking status distribution"
        />
        <ul className="min-w-0 flex-1 space-y-2">
          {segments.map((s) => (
            <li key={s.status} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: statusColor(s.status) }}
                />
                <span className="truncate text-stone-700">{statusLabel(s.status, t)}</span>
              </span>
              <span className="shrink-0 tabular-nums font-semibold text-stone-900">
                {s.count}
                <span className="ml-1 text-xs font-normal text-stone-400">
                  ({Math.round(s.pct)}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

export function ListingsBreakdownChart({
  breakdown,
}: {
  breakdown: OwnerDashboardData["listingsBreakdown"];
}) {
  const { t } = useTranslation();
  const rows = [
    { label: t("charts.chartLive"), value: breakdown.live, color: "bg-green-500" },
    { label: t("charts.chartHidden"), value: breakdown.hidden, color: "bg-stone-400" },
    { label: t("charts.chartPending"), value: breakdown.pending, color: "bg-amber-500" },
    { label: t("charts.chartRejected"), value: breakdown.rejected, color: "bg-red-400" },
  ].filter((r) => r.value > 0);

  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ChartCard
      title={t("charts.equipmentOverview")}
      subtitle={t("charts.listingsTotal", { count: breakdown.total })}
    >
      {breakdown.total === 0 ? (
        <p className="py-6 text-center text-sm text-stone-500">
          <Link to="/equipment/new" className="font-semibold text-brand-600 hover:text-brand-700">
            {t("charts.addFirstListingLink")}
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-stone-600">{r.label}</span>
                <span className="font-semibold tabular-nums text-stone-900">{r.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={cn("h-full rounded-full transition-all", r.color)}
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      {breakdown.total > 0 ? (
        <Link
          to="/dashboard/listings"
          className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {t("charts.manageListings")}
        </Link>
      ) : null}
    </ChartCard>
  );
}

export function CategoryBreakdownChart({
  categories,
}: {
  categories: OwnerDashboardData["equipmentByCategory"];
}) {
  const { t } = useTranslation();
  const max = Math.max(...categories.map((c) => c.count), 1);
  const palette = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ec4899", "#14b8a6"];

  return (
    <ChartCard title={t("charts.byCategory")} subtitle={t("charts.listingsBreakdown")}>
      {categories.length === 0 ? (
        <p className="py-6 text-center text-sm text-stone-500">{t("charts.noCategories")}</p>
      ) : (
        <ul className="space-y-3">
          {categories.map((c, i) => (
            <li key={c.categoryId}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="min-w-0 truncate text-stone-600">{c.categoryName}</span>
                <span className="shrink-0 font-semibold tabular-nums text-stone-900">
                  {c.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(c.count / max) * 100}%`,
                    backgroundColor: palette[i % palette.length],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}

export function TopEquipmentTable({
  items,
}: {
  items: OwnerDashboardData["topEquipment"];
}) {
  const { t } = useTranslation();
  return (
    <ChartCard title={t("charts.topEquipment")} subtitle={t("charts.topSubtitle")}>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-stone-500">{t("charts.completeToRank")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                <th className="pb-3 pe-4">{t("dashboardPage.tableEquipment")}</th>
                <th className="pb-3 pe-4 text-end">{t("charts.tableBookingsCol")}</th>
                <th className="pb-3 pe-4 text-end">{t("charts.tableGross")}</th>
                <th className="pb-3 text-end">{t("charts.tableNet")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={row.id} className="border-b border-stone-200 last:border-0">
                  <td className="py-3 pr-4">
                    <Link
                      to={`/equipment/${row.id}`}
                      className="flex items-center gap-3 hover:text-brand-600"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-600">
                        {idx + 1}
                      </span>
                      {row.image ? (
                        <img
                          src={row.image}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-stone-100" />
                      )}
                      <span className="font-medium text-stone-900 line-clamp-1">
                        {row.title}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-stone-600">
                    {row.bookings}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-stone-600">
                    {formatCurrency(row.revenueGross)}
                  </td>
                  <td className="py-3 text-right font-display font-semibold tabular-nums text-brand-600">
                    {formatCurrency(row.revenueNet)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
}

export function MonthChangeBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        up ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {up ? "+" : ""}
      {pct}% vs last month
    </span>
  );
}
