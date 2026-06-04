import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { useLocaleStore } from "@/store/localeStore";
import {
  formatChartDayLabel,
  formatCurrency,
  formatDateRangeLocalized,
  formatDisplayDate,
  formatMonthShort,
  formatMonthYear,
  getDateFnsLocale,
} from "@/utils/localeFormat";

export function useLocaleFormat() {
  const language = useLocaleStore((s) => s.language);

  return useMemo(
    () => ({
      language,
      formatCurrency: (amount: number) => formatCurrency(amount, language),
      formatMonthYear: (date: string | Date) => formatMonthYear(date, language),
      formatMonthShort: (monthKey: string) => formatMonthShort(monthKey, language),
      formatChartDayLabel: (dateKey: string) => formatChartDayLabel(dateKey, language),
      formatDisplayDate: (date: string | Date, pattern?: string) =>
        formatDisplayDate(date, language, pattern),
      formatDateRange: (start: string, end: string) =>
        formatDateRangeLocalized(start, end, language),
      formatRelativeTime: (date: string | Date) =>
        formatDistanceToNow(typeof date === "string" ? new Date(date) : date, {
          addSuffix: true,
          locale: getDateFnsLocale(language),
        }),
    }),
    [language]
  );
}
