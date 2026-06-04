import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Package, PackagePlus, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { OwnerListingCard } from "@/components/equipment/OwnerListingCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useMyEquipment } from "@/hooks/useMyEquipment";
import { getApiErrorDetail } from "@/services/api";
import * as equipmentService from "@/services/equipment.service";
import { cn } from "@/utils/cn";
import { useNotificationHighlight } from "@/hooks/useNotificationHighlight";

export function DashboardListings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { equipment: mine, isLoading, refetch } = useMyEquipment();
  const highlightedId = useNotificationHighlight(refetch);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (searchParams.get("highlight")) {
      setQuery("");
    }
  }, [searchParams]);

  useEffect(() => {
    const main = document.querySelector("main");
    main?.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mine;
    return mine.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.name.toLowerCase().includes(q) ||
        e.category.slug.toLowerCase().includes(q)
    );
  }, [mine, query]);

  const stats = useMemo(() => {
    const pending = mine.filter((e) => e.approvalStatus === "PENDING").length;
    const live = mine.filter((e) => e.approvalStatus === "APPROVED" && e.isAvailable).length;
    const hidden = mine.filter(
      (e) => e.approvalStatus === "APPROVED" && !e.isAvailable
    ).length;
    const rejected = mine.filter((e) => e.approvalStatus === "REJECTED").length;
    return { total: mine.length, pending, live, hidden, rejected };
  }, [mine]);

  async function setAvailability(id: string, isAvailable: boolean) {
    await equipmentService.updateEquipment(id, { isAvailable });
    toast.success(isAvailable ? t("listing.nowLive") : t("listing.nowHidden"));
    await refetch();
  }

  async function remove(id: string) {
    try {
      await equipmentService.deleteEquipment(id);
      toast.success(t("listing.deleted"));
      await refetch();
    } catch (e) {
      toast.error(getApiErrorDetail(e).message);
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            {t("listing.inventoryEyebrow")}
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-stone-900 md:text-3xl">
            {t("listing.myListingsTitle")}
          </h2>
          <p className="mt-1 max-w-md text-sm text-stone-500">{t("listing.reviewHint")}</p>
        </div>
        <Link
          to="/equipment/new"
          className="btn btn-primary inline-flex shrink-0 items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t("listing.addListing")}
        </Link>
      </motion.div>

      {mine.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("listing.statTotalListings"), value: stats.total, icon: Package, tone: "bg-stone-100 text-stone-700 dark:bg-stone-800/60 dark:text-stone-300" },
            { label: t("listing.statPendingReview"), value: stats.pending, icon: Package, tone: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" },
            { label: t("listing.statLiveSearch"), value: stats.live, icon: Eye, tone: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300" },
            { label: t("listing.statHiddenRejected"), value: stats.hidden + stats.rejected, icon: EyeOff, tone: "bg-stone-100 text-stone-600 dark:bg-stone-800/60 dark:text-stone-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-canvas-card p-4 shadow-sm"
              >
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", stat.tone)}>
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums text-stone-900">{stat.value}</p>
                  <p className="text-xs font-medium text-stone-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {mine.length > 0 ? (
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("listing.searchPlaceholder")}
            className="input w-full ps-10"
          />
        </div>
      ) : null}

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : !mine.length ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-canvas-card py-16">
          <EmptyState
            icon={PackagePlus}
            title={t("listing.noListings")}
            subtitle={t("listing.firstListingSubtitle")}
            action={{
              label: t("listing.firstListingCta"),
              onClick: () => navigate("/equipment/new"),
            }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-stone-200 bg-canvas-card px-4 py-8 text-center text-sm text-stone-500">
          {t("listing.noMatch", { query })}
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((item, i) => (
            <OwnerListingCard
              key={item.id}
              item={item}
              index={i}
              highlighted={highlightedId === item.id}
              onSetAvailability={async (id, available) => {
                try {
                  await setAvailability(id, available);
                } catch (e) {
                  toast.error(getApiErrorDetail(e).message);
                  throw e;
                }
              }}
              onDelete={setDeleteId}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title={t("listing.deleteTitle")}
        description={t("listing.deleteBody")}
        confirmLabel={t("common.delete")}
        onConfirm={() => deleteId && void remove(deleteId)}
      />
    </div>
  );
}
