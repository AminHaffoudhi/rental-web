import { Search } from "lucide-react";
import { CategoryIcon } from "@/components/equipment/CategoryIcon";
import { ALL_CATEGORY_FILTER, buildCategoryFilters } from "@/config/categories";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/utils/cn";

interface CategoryFilterProps {
  /** Selected category slug, or null for all */
  selected?: string | null;
  onSelect: (categorySlug: string | null) => void;
}

export function CategoryFilter({ selected = null, onSelect }: CategoryFilterProps) {
  const { categories, isLoading } = useCategories();
  const filters = buildCategoryFilters(categories);

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex gap-2 pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-stone-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1 pt-0.5">
        {filters.map((c) => {
          const active =
            c.value === ALL_CATEGORY_FILTER.value ? selected === null : selected === c.value;
          const iconUrl = "iconUrl" in c ? c.iconUrl : undefined;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() =>
                onSelect(c.value === ALL_CATEGORY_FILTER.value ? null : c.value)
              }
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-[18px] py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-500 text-white shadow-warm"
                  : "border border-stone-200 bg-canvas-card text-stone-600 hover:border-stone-300"
              )}
            >
              {c.value === ALL_CATEGORY_FILTER.value ? (
                <Search
                  aria-hidden
                  className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-stone-500")}
                  strokeWidth={2}
                />
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md">
                  <CategoryIcon
                    iconUrl={iconUrl}
                    name={c.label}
                    className={cn("h-4 w-4", active ? "text-white" : "text-stone-500")}
                    imgClassName="h-4 w-4"
                  />
                </span>
              )}
              {c.label}
            </button>
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-10 bg-gradient-to-l from-stone-50 to-transparent md:hidden"
        aria-hidden
      />
    </div>
  );
}
