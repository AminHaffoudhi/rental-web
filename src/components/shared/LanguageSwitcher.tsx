import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageFlag } from "@/components/shared/LanguageFlag";
import { SUPPORTED_LANGUAGES, type AppLanguage } from "@/i18n";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/utils/cn";

const LANG_LABEL_KEYS: Record<AppLanguage, string> = {
  en: "language.en",
  fr: "language.fr",
  ar: "language.ar",
};

function LanguageOption({ code }: { code: AppLanguage }) {
  const { t } = useTranslation();
  const label = t(LANG_LABEL_KEYS[code]);
  return (
    <span className="flex items-center gap-2">
      <LanguageFlag code={code} title={label} />
      <span>{label}</span>
    </span>
  );
}

export function LanguageSwitcher(props: {
  className?: string;
  compact?: boolean;
}): ReactElement {
  const { t } = useTranslation();
  const language = useLocaleStore((s) => s.language);
  const setLanguage = useLocaleStore((s) => s.setLanguage);

  return (
    <div className={cn("flex items-center", props.className)}>
      <Select value={language} onValueChange={(v) => setLanguage(v as AppLanguage)}>
        <SelectTrigger
          className={cn(
            "h-9 gap-2 border-stone-200 bg-canvas-card text-xs font-medium dark:border-stone-700 [&>span]:flex [&>span]:items-center [&>span]:gap-2",
            props.compact ? "w-[8.25rem] px-2.5" : "w-[9.5rem] px-3 sm:w-[10.5rem]"
          )}
          aria-label={t("language.label")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {SUPPORTED_LANGUAGES.map((code) => (
            <SelectItem key={code} value={code} className="text-sm">
              <LanguageOption code={code} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
