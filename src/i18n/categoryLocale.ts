import type { TFunction } from "i18next";

/** Localized category label/description by API slug; falls back to API text. */
export function localizedCategory(
  slug: string,
  fallback: { name: string; description?: string | null },
  t: TFunction
): { name: string; description: string } {
  const nameKey = `categories.${slug}.name`;
  const descKey = `categories.${slug}.description`;
  const name = t(nameKey, { defaultValue: fallback.name });
  const description = t(descKey, {
    defaultValue: fallback.description?.trim() || "",
  });
  return { name, description };
}
