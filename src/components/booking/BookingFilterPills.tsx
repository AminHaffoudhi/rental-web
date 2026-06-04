import { cn } from "@/utils/cn";

export type BookingFilterTab = {
  id: string;
  label: string;
  count?: number;
};

type BookingFilterPillsProps = {
  tabs: BookingFilterTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
};

export function BookingFilterPills({
  tabs,
  activeId,
  onChange,
  className,
}: BookingFilterPillsProps) {
  return (
    <div
      className={cn(
        "scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1",
        className
      )}
      role="tablist"
    >
      {tabs.map((t) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              active
                ? "border-brand-500 bg-brand-500 text-white shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
                : "border-stone-200 bg-canvas-card text-stone-600 hover:border-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            )}
          >
            {t.label}
            {t.count !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs tabular-nums",
                  active ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                )}
              >
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
