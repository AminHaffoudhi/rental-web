import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n, { LANGUAGE_STORAGE_KEY, type AppLanguage } from "@/i18n";

interface LocaleState {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

function applyDocumentLanguage(language: AppLanguage): void {
  const root = document.documentElement;
  root.lang = language;
  root.dir = language === "ar" ? "rtl" : "ltr";
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => {
        void i18n.changeLanguage(language);
        applyDocumentLanguage(language);
        set({ language });
      },
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        const lang = state?.language ?? "en";
        void i18n.changeLanguage(lang);
        applyDocumentLanguage(lang);
      },
    }
  )
);

applyDocumentLanguage("en");
