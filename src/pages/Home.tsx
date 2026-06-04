import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeCta } from "@/components/home/HomeCta";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeTrust } from "@/components/home/HomeTrust";
import { buildCategoryFilters } from "@/config/categories";
import { useCategories } from "@/hooks/useCategories";
import { useEquipmentList } from "@/hooks/useEquipment";

export function Home() {
  const { equipment, isLoading, error, refetch } = useEquipmentList({ limit: 6 });
  const { categories, isLoading: categoriesLoading } = useCategories();
  const hasApiCategories = categories.length > 0;

  return (
    <div className="overflow-x-hidden bg-canvas">
      <HomeHero />
      <HomeStats />
      {hasApiCategories ? (
        <HomeCategories categories={buildCategoryFilters(categories)} />
      ) : categoriesLoading ? (
        <section className="border-y border-stone-200 bg-canvas-card py-16 dark:border-stone-800">
          <div className="container">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl bg-stone-100 dark:bg-stone-800"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <HomeHowItWorks />
      <HomeFeatured
        equipment={equipment}
        isLoading={isLoading}
        error={error}
        onRetry={() => void refetch()}
      />
      <HomeTrust />
      <HomeCta />
    </div>
  );
}
