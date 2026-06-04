import type { AppLanguage } from "@/i18n";
import { useLocaleStore } from "@/store/localeStore";
import { formatCurrency as formatCurrencyLocalized } from "@/utils/localeFormat";

function activeLanguage(language?: AppLanguage): AppLanguage {
  return language ?? useLocaleStore.getState().language;
}

/** Uses the active UI language from locale store when `language` is omitted. */
export function formatCurrency(amount: number, language?: AppLanguage): string {
  return formatCurrencyLocalized(amount, activeLanguage(language));
}
