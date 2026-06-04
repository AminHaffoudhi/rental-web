import { Star } from "lucide-react";
import { SectionReveal } from "@/components/home/SectionReveal";

const stats = [
  { value: "2,400+", label: "Active listings" },
  { value: "1,800+", label: "Verified owners" },
  { value: "12,000+", label: "Completed rentals" },
  { value: "4.9", label: "Average rating", showStar: true },
] as const;

export function HomeStats() {
  return (
    <SectionReveal>
      <div className="container -mt-2 pb-10 sm:-mt-4 sm:pb-12">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-elevated sm:rounded-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center px-4 py-7 text-center sm:px-6 sm:py-9 ${
                  i % 2 === 0 ? "border-r border-stone-200" : ""
                } ${i < 2 ? "border-b border-stone-200 sm:border-b-0" : ""} ${
                  i > 0 && i < 4 ? "sm:border-l sm:border-stone-200" : ""
                }`}
              >
                {"showStar" in s && s.showStar ? (
                  <p className="flex items-center gap-1.5 font-display text-2xl font-semibold tabular-nums text-stone-900 sm:text-3xl">
                    {s.value}
                    <Star
                      className="h-5 w-5 fill-amber-400 text-amber-400 sm:h-6 sm:w-6"
                      aria-hidden
                    />
                  </p>
                ) : (
                  <p className="font-display text-2xl font-semibold tabular-nums text-stone-900 sm:text-3xl">
                    {s.value}
                  </p>
                )}
                <p className="mt-1.5 text-xs font-medium text-stone-500 sm:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
