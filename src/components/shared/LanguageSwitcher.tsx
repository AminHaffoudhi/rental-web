import type { ReactElement } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, type AppLanguage } from "@/i18n";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/utils/cn";

const LANG_LABEL_KEYS: Record<AppLanguage, string> = {
  en: "language.en",
  fr: "language.fr",
  ar: "language.ar",
};

export function LanguageSwitcher(props: {
  className?: string;
  compact?: boolean;
}): ReactElement {
  const { t } = useTranslation();
  const language = useLocaleStore((s) => s.language);
  const setLanguage = useLocaleStore((s) => s.setLanguage);

  return (
    <div className={cn("flex items-center gap-1.5", props.className)}>
      {!props.compact ? (
        <Languages className="h-4 w-4 shrink-0 text-stone-500 dark:text-stone-400" aria-hidden />
      ) : null}
      <Select value={language} onValueChange={(v) => setLanguage(v as AppLanguage)}>
        <SelectTrigger
          className={cn(
            "h-9 border-stone-200 bg-canvas-card text-xs font-medium dark:border-stone-700",
            props.compact ? "w-[7.5rem]" : "w-[8.5rem] sm:w-[9.5rem]"
          )}
          aria-label={t("language.label")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {SUPPORTED_LANGUAGES.map((code) => (
            <SelectItem key={code} value={code} className="text-sm">
              {t(LANG_LABEL_KEYS[code])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
