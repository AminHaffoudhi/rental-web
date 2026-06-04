import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "@/store/localeStore";

/** Keeps react-i18next in sync with persisted locale (e.g. after hydration). */
export function I18nSync() {
  const language = useLocaleStore((s) => s.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return null;
}
