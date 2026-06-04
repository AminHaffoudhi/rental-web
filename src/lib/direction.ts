import type { AppLanguage } from "@/i18n";

export type TextDirection = "ltr" | "rtl";

export function directionForLanguage(language: AppLanguage): TextDirection {
  return language === "ar" ? "rtl" : "ltr";
}

/** Apply `lang` + `dir` on <html> (single source of truth for layout direction). */
export function applyDocumentDirection(language: AppLanguage): void {
  const root = document.documentElement;
  root.lang = language;
  root.dir = directionForLanguage(language);
}
