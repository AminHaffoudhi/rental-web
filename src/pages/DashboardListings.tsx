import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Package, PackagePlus, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OwnerListingCard } from "@/components/equipment/OwnerListingCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useEquipmentList } from "@/hooks/useEquipment";
import { getApiErrorDetail } from "@/services/api";
import * as equipmentService from "@/services/equipment.service";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

export function DashboardListings() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { equipment, isLoading, refetch } = useEquipmentList({
    availableOnly: false,
    pageSize: 100,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const main = document.querySelector("main");
    main?.scrollTo(0, 0);
  }, []);

  const mine = useMemo(
    () => (user ? equipment.filter((e) => e.owner.id === user.id) : []),
    [equipment, user]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mine;
    return mine.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [mine, query]);

  const stats = useMemo(() => {
    const live = mine.filter((e) => e.isAvailable).length;
    return { total: mine.length, live, hidden: mine.length - live };
  }, [mine]);

  async function setAvailability(id: string, isAvailable: boolean) {
    await equipmentService.updateEquipment(id, { isAvailable });
    toast.success(isAvailable ? "Listing is now live" : "Listing hidden from search");
    await refetch();
  }

  async function remove(id: string) {
    try {
      await equipmentService.deleteEquipment(id);
      toast.success("Listing deleted");
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
            Your inventory
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-stone-900 md:text-3xl">
            My Listings
          </h2>
          <p className="mt-1 max-w-md text-sm text-stone-500">
            Manage visibility, pricing, and photos. Hidden listings stay on your dashboard but
            won&apos;t appear in search.
          </p>
        </div>
        <Link
          to="/equipment/new"
          className="btn btn-primary inline-flex shrink-0 items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add New Listing
        </Link>
      </motion.div>

      {mine.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total listings", value: stats.total, icon: Package, tone: "bg-stone-50 text-stone-700" },
            { label: "Live in search", value: stats.live, icon: Eye, tone: "bg-green-50 text-green-700" },
            { label: "Hidden", value: stats.hidden, icon: EyeOff, tone: "bg-amber-50 text-amber-800" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm"
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
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your listings…"
            className="input w-full pl-10"
          />
        </div>
      ) : null}

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : !mine.length ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white py-16">
          <EmptyState
            icon={PackagePlus}
            title="No listings yet"
            subtitle="Publish your first piece of equipment to start earning."
            action={{
              label: "Add your first listing",
              onClick: () => navigate("/equipment/new"),
            }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-stone-100 bg-white px-4 py-8 text-center text-sm text-stone-500">
          No listings match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((item, i) => (
            <OwnerListingCard
              key={item.id}
              item={item}
              index={i}
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
        title="Delete listing?"
        description="This cannot be undone. Any active bookings may still reference this equipment."
        confirmLabel="Delete"
        onConfirm={() => deleteId && void remove(deleteId)}
      />
    </div>
  );
}
