import { Link } from "react-router-dom";
import { Heart, MapPin, Package, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "@/components/user/UserAvatar";
import { CategoryIcon } from "@/components/equipment/CategoryIcon";
import type { Equipment } from "@/types/equipment";
import { useLocaleFormat } from "@/hooks/useLocaleFormat";
import { localizedCategory } from "@/i18n/categoryLocale";
import { cn } from "@/utils/cn";
import { equipmentReviewStats } from "@/utils/reviewStats";

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocaleFormat();
  const img = equipment.images[0];
  const cat = equipment.category;
  const catLabel = cat
    ? localizedCategory(cat.slug, { name: cat.name }, t).name
    : t("equipment.defaultCategory");

  const { count: reviewCount, average: avgRating } = equipmentReviewStats(equipment);
  const roundedRating = avgRating !== null ? Math.round(avgRating * 10) / 10 : null;

  const [favorited, setFavorited] = useState(false);

  const dailyFormatted = formatCurrency(equipment.dailyRate);

  return (
    <div
      className={cn(
        "group/card relative w-full overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-elevated",
        "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:-translate-y-1 hover:border-stone-200 hover:shadow-lg"
      )}
    >
      <button
        type="button"
        className="absolute end-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-canvas-card/95 text-stone-400 shadow-elevated ring-1 ring-stone-200 transition-colors hover:text-red-500"
        aria-label={favorited ? t("equipment.removeFavorite") : t("equipment.addFavorite")}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setFavorited((v) => !v);
        }}
      >
        <Heart
          className={cn("h-4 w-4", favorited && "fill-red-500 text-red-500")}
          strokeWidth={2}
        />
      </button>

      <Link to={`/equipment/${equipment.id}`} className="block cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-brand-50">
          {img ? (
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/card:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-500/40">
              <CategoryIcon
                iconUrl={cat?.iconUrl}
                name={catLabel}
                className="h-16 w-16"
                imgClassName="h-16 w-16"
              />
            </div>
          )}
          <span className="badge badge-brand absolute start-2 top-2 z-10 shadow-sm">{catLabel}</span>
        </div>

        <div className="p-4">
          <h3 className="font-display text-base font-semibold leading-snug text-stone-900 line-clamp-1">
            {equipment.title}
          </h3>

          <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-brand-500">
            <MapPin className="h-3 w-3 shrink-0 text-brand-500" aria-hidden />
            <span className="min-w-0 truncate">{equipment.location}</span>
          </p>

          <div className="mt-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <UserAvatar user={equipment.owner} size="xs" />
              <span className="truncate text-[13px] text-stone-600">{equipment.owner.name}</span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              {avgRating !== null ? (
                <>
                  <div className="flex items-center gap-1" aria-hidden>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          "h-3 w-3 fill-current text-amber-500",
                          n <= Math.round(avgRating) ? "opacity-100" : "opacity-30"
                        )}
                      />
                    ))}
                    <span className="ms-0.5 text-[12px] font-medium tabular-nums text-stone-700">
                      {roundedRating}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {reviewCount === 1
                      ? t("equipment.reviewCountParen", { count: reviewCount })
                      : t("equipment.reviewsCountParen", { count: reviewCount })}
                  </span>
                </>
              ) : (
                <span className="text-[12px] font-medium text-stone-400">{t("equipment.new")}</span>
              )}
            </div>
          </div>

          <div className="my-3 h-px bg-stone-100" />

          <div className="flex items-center justify-between gap-3">
            <p className="price-tag text-xl leading-none">
              {dailyFormatted}
              <span>{t("equipment.perDaySuffix")}</span>
            </p>
            <span
              className={cn(
                "inline-flex shrink-0 rounded-full bg-brand-500 px-3.5 py-1.5 text-[13px] font-semibold text-white",
                "opacity-0 transition-opacity duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "group-hover/card:pointer-events-auto group-hover/card:opacity-100"
              )}
            >
              {t("equipment.bookNow")}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
