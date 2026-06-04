import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export interface BookingStatChip {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: "brand" | "blue" | "green" | "amber" | "stone";
}

const TONE_STYLES: Record<NonNullable<BookingStatChip["tone"]>, string> = {
  brand: "border-brand-200/80 bg-brand-50/80 text-brand-800 dark:border-brand-500/25 dark:bg-brand-500/10 dark:text-brand-300",
  blue: "border-blue-200/80 bg-blue-50/80 text-blue-800 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300",
  green: "border-green-200/80 bg-green-50/80 text-green-800 dark:border-green-500/25 dark:bg-green-500/10 dark:text-green-300",
  amber: "border-amber-200/80 bg-amber-50/80 text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300",
  stone:
    "border-stone-200 bg-stone-100/80 text-stone-700 dark:border-stone-600 dark:bg-stone-800/50 dark:text-stone-300",
};

type BookingsPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  stats?: BookingStatChip[];
  className?: string;
};

export function BookingsPageHeader({
  eyebrow,
  title,
  description,
  stats,
  className,
}: BookingsPageHeaderProps) {
  return (
    <header className={cn("relative overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-900/20"
        aria-hidden
      />
      <div className="relative">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-stone-500 sm:text-base">{description}</p>
        ) : null}
        {stats && stats.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-3">
            {stats.map((s) => {
              const Icon = s.icon;
              const tone = s.tone ?? "stone";
              return (
                <div
                  key={s.label}
                  className={cn(
                    "flex min-w-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 sm:min-w-[8.5rem]",
                    TONE_STYLES[tone]
                  )}
                >
                  {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden /> : null}
                  <div className="min-w-0">
                    <p className="text-lg font-semibold tabular-nums leading-none">{s.value}</p>
                    <p className="mt-0.5 truncate text-[11px] font-medium opacity-80">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </header>
  );
}
