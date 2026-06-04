import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading, SectionReveal } from "@/components/home/SectionReveal";
import { cn } from "@/utils/cn";

const testimonialKeys = [
  {
    quote: "home.testimonial1Quote",
    name: "home.testimonial1Name",
    meta: "home.testimonial1Meta",
    initials: "AB",
    accent: "border-brand-200 bg-brand-50/50",
  },
  {
    quote: "home.testimonial2Quote",
    name: "home.testimonial2Name",
    meta: "home.testimonial2Meta",
    initials: "SM",
    accent: "border-emerald-200 bg-emerald-50/50",
  },
  {
    quote: "home.testimonial3Quote",
    name: "home.testimonial3Name",
    meta: "home.testimonial3Meta",
    initials: "YK",
    accent: "border-sky-200 bg-sky-50/50",
  },
] as const;

export function HomeTestimonials() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-stone-200 bg-stone-100/40 py-14 sm:py-16 md:py-20 lg:py-24 dark:bg-stone-900/30">
      <SectionReveal className="container">
        <SectionHeading
          eyebrow={t("home.testimonialsEyebrow")}
          title={t("home.testimonialsTitle")}
          subtitle={t("home.testimonialsSubtitle")}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {testimonialKeys.map((item, i) => (
            <article
              key={item.initials}
              className={cn(
                "flex h-full flex-col rounded-2xl border bg-canvas-card p-6 shadow-elevated sm:p-7",
                item.accent
              )}
            >
              <div className="mb-4 flex gap-0.5" aria-hidden>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-stone-700 sm:text-base">
                &ldquo;{t(item.quote)}&rdquo;
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 border-t border-stone-200/80 pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-900">{t(item.name)}</p>
                  <p className="truncate text-xs text-stone-500 sm:text-sm">{t(item.meta)}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
