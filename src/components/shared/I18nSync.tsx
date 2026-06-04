import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { applyDocumentDirection } from "@/lib/direction";
import { useLocaleStore } from "@/store/localeStore";

/** Keeps i18n + document direction in sync with persisted locale. */
export function I18nSync() {
  const language = useLocaleStore((s) => s.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    applyDocumentDirection(language);
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return null;
}
