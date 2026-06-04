import { format, parseISO } from "date-fns";
import { ar, enUS, fr } from "date-fns/locale";
import type { AppLanguage } from "@/i18n";

const dateLocales = { en: enUS, fr, ar } as const;

const intlLocales: Record<AppLanguage, string> = {
  en: "en-TN",
  fr: "fr-TN",
  ar: "ar-TN",
};

export function getDateFnsLocale(language: AppLanguage) {
  return dateLocales[language] ?? enUS;
}

const currencySuffix: Record<AppLanguage, string> = {
  en: "TND",
  fr: "DT",
  ar: "د.ت",
};

/** Locale-aware money: Arabic uses د.ت; French TN uses DT. */
export function formatCurrency(amount: number, language: AppLanguage = "en"): string {
  const number = new Intl.NumberFormat(intlLocales[language], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${number} ${currencySuffix[language]}`;
}

/** Short month from API key `yyyy-MM` (e.g. chart x-axis). */
export function formatMonthShort(monthKey: string, language: AppLanguage = "en"): string {
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;
  const d = new Date(year, month - 1, 1);
  return format(d, "MMM", { locale: getDateFnsLocale(language) });
}

/** Compact day label from ISO date `yyyy-MM-dd` (booking trend chart). */
export function formatChartDayLabel(dateKey: string, language: AppLanguage = "en"): string {
  const d = parseISO(dateKey);
  return format(d, "d MMM", { locale: getDateFnsLocale(language) });
}

export function formatDisplayDate(
  date: string | Date,
  language: AppLanguage = "en",
  pattern = "PPP"
): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: getDateFnsLocale(language) });
}

export function formatMonthYear(date: string | Date, language: AppLanguage = "en"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMMM yyyy", { locale: getDateFnsLocale(language) });
}

export function formatDateRangeLocalized(
  start: string,
  end: string,
  language: AppLanguage = "en"
): string {
  const sep = language === "ar" ? " – " : " – ";
  return `${formatDisplayDate(start, language)}${sep}${formatDisplayDate(end, language)}`;
}
