import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n, { LANGUAGE_STORAGE_KEY, type AppLanguage } from "@/i18n";
import { applyDocumentDirection } from "@/lib/direction";

interface LocaleState {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => {
        applyDocumentDirection(language);
        void i18n.changeLanguage(language);
        set({ language });
      },
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        const lang = state?.language ?? "en";
        applyDocumentDirection(lang);
        void i18n.changeLanguage(lang);
      },
    }
  )
);
