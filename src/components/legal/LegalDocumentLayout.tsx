import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/utils/cn";

type LegalDocumentLayoutProps = {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
  className?: string;
};

export function LegalDocumentLayout({
  title,
  description,
  lastUpdated,
  children,
  className,
}: LegalDocumentLayoutProps) {
  const { t } = useTranslation();
  const language = useLocaleStore((s) => s.language);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-stone-200 bg-canvas-card/80">
        <div className="container max-w-3xl py-6 sm:py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <PlatformLogo size="md" />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-brand-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t("notFound.home")}
            </Link>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-500 sm:text-base">{description}</p>
          <p className="mt-3 text-xs font-medium text-stone-400">
            {t("legal.lastUpdated", { date: lastUpdated })}
          </p>
          {language !== "en" ? (
            <p className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              {t("legal.englishNotice")}
            </p>
          ) : null}
        </div>
      </div>
      <div className="container max-w-3xl py-10 sm:py-14">
        <article className={cn("legal-content", className)}>{children}</article>
        <footer className="mt-12 flex flex-wrap gap-4 border-t border-stone-200 pt-8 text-sm">
          <Link to="/terms" className="font-medium text-brand-600 hover:text-brand-700">
            {t("footer.terms")}
          </Link>
          <Link to="/privacy" className="font-medium text-brand-600 hover:text-brand-700">
            {t("footer.privacy")}
          </Link>
          <Link to="/contact" className="font-medium text-brand-600 hover:text-brand-700">
            {t("footer.contactUs")}
          </Link>
        </footer>
      </div>
    </div>
  );
}
