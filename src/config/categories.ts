import { Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { EquipmentCategory } from "@/types/category";

export type CategoryFilterValue = "ALL" | string;

export const ALL_CATEGORY_FILTER = {
  value: "ALL" as const,
  label: "All Equipment",
  icon: Search,
  color: "bg-stone-100 text-stone-700",
};

export function buildCategoryFilters(categories: EquipmentCategory[]) {
  const active = [...categories]
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return [
    ALL_CATEGORY_FILTER,
    ...active.map((c) => ({
      value: c.slug,
      id: c.id,
      label: c.name,
      description: c.description,
      iconUrl: c.iconUrl,
      color: c.color,
      icon: null as LucideIcon | null,
    })),
  ];
}

export function findCategoryBySlug(
  categories: EquipmentCategory[],
  slug: string | null | undefined
): EquipmentCategory | undefined {
  if (!slug || slug === "ALL") return undefined;
  return categories.find((c) => c.slug === slug || c.id === slug);
}

export function findCategoryById(
  categories: EquipmentCategory[],
  id: string | undefined
): EquipmentCategory | undefined {
  if (!id) return undefined;
  return categories.find((c) => c.id === id);
}

/** Normalize a category slug from URL query params (API-driven slugs only). */
export function normalizeCategorySlug(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const slug = raw.trim().toLowerCase();
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return slug;
  return null;
}

export function resolveCategorySlug(
  categories: EquipmentCategory[],
  raw: string | null | undefined
): string | null {
  const normalized = normalizeCategorySlug(raw);
  if (!normalized) return null;
  const match = categories.find(
    (c) => c.isActive !== false && (c.slug === normalized || c.id === normalized)
  );
  return match?.slug ?? null;
}
