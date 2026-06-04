import type { AppLanguage } from "@/i18n";
import { cn } from "@/utils/cn";

type LanguageFlagProps = {
  code: AppLanguage;
  className?: string;
  title?: string;
};

/** Small flag icons for the language switcher (en → UK, fr → France, ar → Tunisia). */
export function LanguageFlag({ code, className, title }: LanguageFlagProps) {
  const shared = cn(
    "inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] shadow-sm ring-1 ring-black/10 dark:ring-white/15",
    className
  );

  switch (code) {
    case "en":
      return (
        <svg
          viewBox="0 0 60 40"
          className={shared}
          role="img"
          aria-hidden={title ? undefined : true}
          aria-label={title}
        >
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
          <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
          <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
          <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );
    case "fr":
      return (
        <svg
          viewBox="0 0 3 2"
          className={shared}
          role="img"
          aria-hidden={title ? undefined : true}
          aria-label={title}
        >
          <rect width="1" height="2" fill="#002395" />
          <rect x="1" width="1" height="2" fill="#fff" />
          <rect x="2" width="1" height="2" fill="#ED2939" />
        </svg>
      );
    case "ar":
      // Tunisia — Wikimedia Commons geometry (viewBox −60 −40 120×80, ratio 3:2)
      return (
        <svg
          viewBox="-60 -40 120 80"
          className={shared}
          xmlns="http://www.w3.org/2000/svg"
          fill="#E70013"
          role="img"
          aria-hidden={title ? undefined : true}
          aria-label={title}
        >
          <path d="M-60-40H60v80H-60z" />
          <circle fill="#fff" r="20" />
          <circle r="15" />
          <circle fill="#fff" cx="4" r="12" />
          <path d="M-5 0l16.281-5.29L1.22 8.56V-8.56L11.28 5.29z" />
        </svg>
      );
    default:
      return null;
  }
}
