import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/home/SectionReveal";
import { PLATFORM_NAME } from "@/config/brand";

export function HomeCta() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-t border-brand-600/20">
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-16 bottom-0 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.35) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <SectionReveal className="container relative py-14 text-center sm:py-16 md:py-20 lg:py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-sm sm:text-sm">
          <Sparkles className="h-4 w-4" aria-hidden />
          {t("home.ctaBadge")}
        </span>
        <h2 className="mx-auto mt-5 max-w-2xl font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
          {t("home.ctaHeading")}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
          {t("home.ctaBodyLong", { name: PLATFORM_NAME })}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/equipment/new"
            className="btn btn-xl inline-flex w-full max-w-xs justify-center gap-2 bg-white font-semibold text-brand-700 shadow-lg hover:bg-brand-50 sm:w-auto sm:max-w-none rtl:flex-row-reverse"
          >
            {t("home.ctaList")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <Link
            to="/search"
            className="btn btn-xl inline-flex w-full max-w-xs justify-center border-2 border-white/40 bg-transparent font-semibold text-white hover:bg-canvas-card/10 sm:w-auto sm:max-w-none"
          >
            {t("home.ctaBrowse")}
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/75">{t("home.ctaFinePrint")}</p>
      </SectionReveal>
    </section>
  );
}
