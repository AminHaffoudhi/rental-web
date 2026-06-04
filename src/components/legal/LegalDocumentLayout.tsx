import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { useLocaleFormat } from "@/hooks/useLocaleFormat";
import { LEGAL_LAST_UPDATED_ISO } from "@/content/legal/registry";
import { cn } from "@/utils/cn";

type LegalDocumentLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function LegalDocumentLayout({
  title,
  description,
  children,
  className,
}: LegalDocumentLayoutProps) {
  const { t } = useTranslation();
  const { formatDisplayDate } = useLocaleFormat();
  const lastUpdated = formatDisplayDate(LEGAL_LAST_UPDATED_ISO, "PPP");

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-stone-200 bg-canvas-card/80 dark:border-stone-800">
        <div className="container max-w-3xl py-6 sm:py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <PlatformLogo size="md" />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-brand-600 dark:text-stone-400 dark:hover:text-brand-400"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
              {t("notFound.home")}
            </Link>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-500 dark:text-stone-400 sm:text-base">
            {description}
          </p>
          <p className="mt-3 text-xs font-medium text-stone-400 dark:text-stone-500">
            {t("legal.lastUpdated", { date: lastUpdated })}
          </p>
        </div>
      </div>
      <div className="container max-w-3xl py-10 sm:py-14">
        <article className={cn("legal-content", className)}>{children}</article>
        <footer className="mt-12 flex flex-wrap gap-4 border-t border-stone-200 pt-8 text-sm dark:border-stone-800">
          <Link to="/terms" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            {t("footer.terms")}
          </Link>
          <Link to="/privacy" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            {t("footer.privacy")}
          </Link>
          <Link to="/contact" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            {t("footer.contactUs")}
          </Link>
        </footer>
      </div>
    </div>
  );
}
