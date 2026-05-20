import { CATEGORIES } from "@/config/categories";
import type { Category } from "@/types/equipment";
import { cn } from "@/utils/cn";

interface CategoryFilterProps {
  selected?: Category | null;
  onSelect: (category: Category | null) => void;
}

function isActive(value: (typeof CATEGORIES)[number]["value"], selected: Category | null) {
  if (value === "ALL") return selected === null;
  return selected === value;
}

export function CategoryFilter({ selected = null, onSelect }: CategoryFilterProps) {
  return (
    <div className="relative">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1 pt-0.5">
        {CATEGORIES.map((c) => {
          const active = isActive(c.value, selected);
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => onSelect(c.value === "ALL" ? null : c.value)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-[18px] py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-500 text-white shadow-warm"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300"
              )}
            >
              <c.icon
                aria-hidden
                className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-stone-500")}
                strokeWidth={2}
              />
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
