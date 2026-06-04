import { ArrowRight, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionReveal } from "@/components/home/SectionReveal";
import { EmptyState } from "@/components/shared/EmptyState";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import type { Equipment } from "@/types/equipment";

interface HomeFeaturedProps {
  equipment: Equipment[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function HomeFeatured({
  equipment,
  isLoading,
  error,
  onRetry,
}: HomeFeaturedProps) {
  const showEmpty = !isLoading && (error || equipment.length === 0);

  return (
    <section className="border-t border-stone-200 bg-stone-100/40 py-14 sm:py-16 md:py-20 lg:py-24 dark:bg-stone-900/30">
      <SectionReveal className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Fresh picks
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl lg:text-4xl">
              Recently listed
            </h2>
            <p className="mt-2 text-sm text-stone-500 sm:text-base">
              New gear added by owners across Tunisia
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-canvas-card px-4 py-2.5 text-sm font-semibold text-brand-600 shadow-elevated transition-colors hover:border-brand-200 hover:bg-brand-50"
          >
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 sm:mt-10">
          {showEmpty ? (
            <EmptyState
              icon={PackageSearch}
              title={error ? "Couldn't load listings" : "No listings yet"}
              subtitle={
                error
                  ? error.message
                  : "Check back soon — new gear is added every day."
              }
              action={
                error ? { label: "Try again", onClick: onRetry } : undefined
              }
            />
          ) : (
            <EquipmentGrid equipment={equipment} isLoading={isLoading} columns={3} />
          )}
        </div>
      </SectionReveal>
    </section>
  );
}
