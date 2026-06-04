import { eachDayOfInterval, format, parseISO } from "date-fns";
import type { AppLanguage } from "@/i18n";
import { useLocaleStore } from "@/store/localeStore";
import { formatDateRangeLocalized, formatDisplayDate } from "@/utils/localeFormat";

function activeLanguage(language?: AppLanguage): AppLanguage {
  return language ?? useLocaleStore.getState().language;
}

export function formatDate(date: string | Date, language?: AppLanguage): string {
  return formatDisplayDate(date, activeLanguage(language), "MMM d, yyyy");
}

export function formatDateRange(start: string, end: string, language?: AppLanguage): string {
  return formatDateRangeLocalized(start, end, activeLanguage(language));
}

export function getDaysBetween(start: string, end: string): number {
  const s = typeof start === "string" ? parseISO(start) : start;
  const e = typeof end === "string" ? parseISO(end) : end;
  const days = eachDayOfInterval({ start: s, end: e }).length;
  return Math.max(1, days);
}

/** Expand inclusive date range into ISO date strings (yyyy-MM-dd) for calendar disabling */
export function datesInRange(startIso: string, endIso: string): string[] {
  const start = parseISO(startIso);
  const end = parseISO(endIso);
  return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
}
