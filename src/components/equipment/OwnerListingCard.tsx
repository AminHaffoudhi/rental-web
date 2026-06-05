import { motion } from "framer-motion";
import {
  ExternalLink,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GalleryZoomHint, ImageLightbox } from "@/components/shared/ImageLightbox";
import { Switch } from "@/components/ui/switch";
import { CategoryIcon } from "@/components/equipment/CategoryIcon";
import type { Equipment } from "@/types/equipment";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency";
import { equipmentReviewStats } from "@/utils/reviewStats";

interface OwnerListingCardProps {
  item: Equipment;
  index?: number;
  highlighted?: boolean;
  onSetAvailability: (id: string, isAvailable: boolean) => void | Promise<void>;
  onDelete: (id: string) => void;
}

export function OwnerListingCard({
  item,
  index = 0,
  highlighted = false,
  onSetAvailability,
  onDelete,
}: OwnerListingCardProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [available, setAvailable] = useState(item.isAvailable);
  const [toggling, setToggling] = useState(false);
  const cat = item.category;
  const isApproved = item.approvalStatus === "APPROVED";
  const isPending = item.approvalStatus === "PENDING";
  const isRejected = item.approvalStatus === "REJECTED";
  const canToggleVisibility = isApproved;

  const statusBadge = isPending
    ? { label: t("equipment.statusPending"), className: "bg-amber-500 text-white" }
    : isRejected
      ? { label: t("listing.statusRejectedShort"), className: "bg-red-600 text-white" }
      : available
        ? { label: t("listing.statusLiveShort"), className: "bg-green-500 text-white" }
        : { label: t("listing.statusHiddenShort"), className: "bg-stone-700 text-white" };
  const cover = item.images[0];
  const { count: reviewCount } = equipmentReviewStats(item);
  const photos = item.images.filter(Boolean);

  useEffect(() => {
    setAvailable(item.isAvailable);
  }, [item.isAvailable]);

  async function handleAvailabilityChange(checked: boolean) {
    const previous = available;
    setAvailable(checked);
    setToggling(true);
    try {
      await onSetAvailability(item.id, checked);
    } catch {
      setAvailable(previous);
    } finally {
      setToggling(false);
    }
  }

  return (
    <motion.li
      id={`highlight-${item.id}`}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-canvas-card shadow-sm transition-shadow duration-300",
        highlighted
          ? "border-brand-400 ring-2 ring-brand-500 ring-offset-2"
          : "border-stone-100"
      )}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full shrink-0 md:w-56 lg:w-64">
          <button
            type="button"
            onClick={() => photos.length > 0 && setLightboxOpen(true)}
            disabled={!photos.length}
            className={cn(
              "relative block h-44 w-full overflow-hidden rounded-t-2xl bg-brand-50 md:h-full md:min-h-[188px] md:rounded-l-2xl md:rounded-tr-none",
              photos.length > 0 && "cursor-zoom-in"
            )}
            aria-label={photos.length ? t("listing.viewPhotos") : t("listing.noPhotos")}
          >
            {cover ? (
              <img src={cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-brand-400/50">
                <CategoryIcon
                  iconUrl={cat?.iconUrl}
                  name={cat?.name}
                  className="h-14 w-14"
                  imgClassName="h-14 w-14"
                />
              </div>
            )}
            <span
              className={cn(
                "absolute start-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm",
                statusBadge.className
              )}
            >
              {statusBadge.label}
            </span>
            {photos.length > 1 ? (
              <span className="absolute bottom-3 end-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                {t("listing.photoCount", { count: photos.length })}
              </span>
            ) : null}
            {photos.length > 0 ? <GalleryZoomHint className="bottom-3 start-3" /> : null}
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("badge text-[10px]", cat?.color ?? "badge-brand")}>
                  {cat?.name ?? t("equipment.defaultCategory")}
                </span>
                <span className="text-[11px] text-stone-400">
                  {reviewCount > 0
                    ? reviewCount === 1
                      ? t("listing.reviewCountShort", { count: reviewCount })
                      : t("listing.reviewsCountShort", { count: reviewCount })
                    : t("equipment.noReviews")}
                </span>
              </div>
              <Link
                to={`/equipment/${item.id}`}
                className="mt-2 block break-words font-display text-lg font-semibold leading-snug text-stone-900 hover:text-brand-600"
              >
                {item.title}
              </Link>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-stone-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{item.location}</span>
              </p>
            </div>

            <div className="relative shrink-0 md:hidden">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100"
                aria-label={t("listing.moreActions")}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10"
                    aria-label={t("common.close")}
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute end-0 top-10 z-20 min-w-[140px] rounded-xl border border-stone-200 bg-canvas-card py-1 shadow-lg">
                    <Link
                      to={`/equipment/${item.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t("listing.viewListing")}
                    </Link>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(item.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("common.delete")}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid gap-4 border-t border-stone-200 pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
                {t("equipment.dailyRate")}
              </p>
              <p className="price-tag mt-0.5 text-2xl leading-none">
                {Math.round(item.dailyRate)} {t("common.tnd")}
                <span className="text-sm font-normal text-stone-500">{t("equipment.perDaySuffix")}</span>
              </p>
              {item.weeklyRate != null ? (
                <p className="mt-1 text-xs text-stone-500">
                  {t("listing.perWeekPrice", { price: formatCurrency(item.weeklyRate) })}
                </p>
              ) : null}
            </div>

            <div
              className={cn(
                "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 sm:min-w-[220px]",
                canToggleVisibility
                  ? "border-stone-200 bg-stone-100 dark:bg-stone-800/50"
                  : "border-amber-100 bg-amber-50/50"
              )}
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-700">{t("listing.visibleInSearch")}</p>
                <p className="text-[11px] text-stone-500">
                  {isPending
                    ? t("listing.waitingApproval")
                    : isRejected
                      ? item.rejectionNote
                        ? item.rejectionNote
                        : t("listing.editToResubmit")
                      : available
                        ? t("listing.rentersCanFind")
                        : t("listing.turnOnToGoLive")}
                </p>
              </div>
              <Switch
                checked={available}
                disabled={toggling || !canToggleVisibility}
                onCheckedChange={(checked) => void handleAvailabilityChange(checked)}
                className="shrink-0 data-[state=checked]:bg-green-500"
                aria-label={available ? t("listing.hideFromSearch") : t("listing.showInSearch")}
              />
            </div>
          </div>

          <div className="mt-4 hidden gap-2 md:flex">
            <Link
              to={`/equipment/${item.id}`}
              className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("listing.viewPublicPage")}
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("common.delete")}
            </button>
          </div>
        </div>
      </div>

      <ImageLightbox
        images={photos}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        alt={item.title}
      />
    </motion.li>
  );
}
