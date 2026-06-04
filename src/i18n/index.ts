import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/i18n/locales/ar.json";
import en from "@/i18n/locales/en.json";
import fr from "@/i18n/locales/fr.json";

export const SUPPORTED_LANGUAGES = ["en", "fr", "ar"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = "ekri-language";

export function isAppLanguage(value: string): value is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(value as AppLanguage);
}

export function isRtlLanguage(lang: AppLanguage): boolean {
  return lang === "ar";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: "en",
  fallbackLng: "en",
  supportedLngs: [...SUPPORTED_LANGUAGES],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
