import type { LucideIcon } from "lucide-react";
import {
  Dumbbell,
  HardHat,
  Package,
  PartyPopper,
  Search,
  Wrench,
} from "lucide-react";
import type { Category } from "@/types/equipment";

/** Includes ALL for filters; use `CATEGORY_OPTIONS` for forms/API-only categories. */
export type CategoryFilterValue = "ALL" | Category;

export const CATEGORIES: {
  value: CategoryFilterValue;
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  { value: "ALL", label: "All Equipment", icon: Search, color: "bg-stone-100 text-stone-700" },
  {
    value: "CONSTRUCTION",
    label: "Construction",
    icon: HardHat,
    color: "bg-orange-50 text-orange-700",
  },
  { value: "SPORTS", label: "Sports", icon: Dumbbell, color: "bg-green-50 text-green-700" },
  { value: "EVENTS", label: "Events", icon: PartyPopper, color: "bg-purple-50 text-purple-700" },
  { value: "TOOLS", label: "Tools", icon: Wrench, color: "bg-blue-50 text-blue-700" },
  { value: "OTHER", label: "Other", icon: Package, color: "bg-stone-50 text-stone-600" },
];

/** Categories valid for equipment records (excludes ALL). */
export const CATEGORY_OPTIONS = CATEGORIES.filter(
  (c): c is { value: Category; label: string; icon: LucideIcon; color: string } =>
    c.value !== "ALL"
);
