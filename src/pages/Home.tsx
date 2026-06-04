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
  const { categories } = useCategories();

  return (
    <div className="overflow-x-hidden bg-canvas">
      <HomeHero />
      <HomeStats />
      <HomeCategories categories={buildCategoryFilters(categories)} />
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
