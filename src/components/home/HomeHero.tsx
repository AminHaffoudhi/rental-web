import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Drill,
  MapPin,
  Shield,
  Tent,
  Trophy,
  Truck,
  Wrench,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchBar } from "@/components/shared/SearchBar";
import { cn } from "@/utils/cn";

const showcaseItemDefs = [
  {
    icon: Drill,
    titleKey: "home.showcaseDrillTitle",
    locationKey: "home.showcaseDrillLocation",
    price: 45,
    accent: "from-brand-100 to-brand-50",
    delay: 0.05,
    className: "sm:col-start-1 sm:row-start-1",
  },
  {
    icon: Trophy,
    titleKey: "home.showcaseGoalsTitle",
    locationKey: "home.showcaseGoalsLocation",
    price: 30,
    accent: "from-emerald-50 to-canvas-card",
    delay: 0.12,
    className: "sm:col-start-2 sm:row-start-1 sm:translate-y-4",
  },
  {
    icon: Tent,
    titleKey: "home.showcaseTentTitle",
    locationKey: "home.showcaseTentLocation",
    price: 80,
    accent: "from-sky-50 to-canvas-card",
    delay: 0.18,
    className: "sm:col-start-1 sm:row-start-2",
  },
  {
    icon: Wrench,
    titleKey: "home.showcaseToolsTitle",
    locationKey: "home.showcaseToolsLocation",
    price: 35,
    accent: "from-violet-50 to-canvas-card",
    delay: 0.24,
    className: "sm:col-start-2 sm:row-start-2 sm:-translate-y-2",
  },
] as const;

const popularCategorySlugs = ["construction", "sports", "events"] as const;

const trustPillKeys = [
  { icon: BadgeCheck, key: "home.trustVerified" },
  { icon: Shield, key: "home.trustSecure" },
  { icon: Truck, key: "home.trustDelivery" },
] as const;

export function HomeHero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-canvas-card">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-[360px] w-[360px] rounded-full bg-brand-100/60 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(231 229 228 / 0.5) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />

      <div className="container relative py-10 sm:py-14 md:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-20">
          <div className="min-w-0">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-800 shadow-sm sm:px-4 sm:text-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              {t("footer.tagline")}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="mt-5 font-display text-[1.85rem] font-semibold leading-[1.12] tracking-tight text-stone-900 min-[400px]:text-[2.1rem] sm:mt-6 sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            >
              {t("home.heroTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-4 max-w-lg text-base leading-relaxed text-stone-600 sm:mt-5 sm:text-lg"
            >
              {t("home.heroSubtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-6 sm:mt-8"
            >
              <SearchBar
                showButton
                instant={false}
                placeholder={t("nav.searchEquipmentPlaceholder")}
                onSearch={(q) =>
                  navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
                }
              />
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500 sm:text-sm">
                <span className="font-medium text-stone-600">{t("home.popularLabel")}</span>
                {popularCategorySlugs.map((slug) => (
                  <Link
                    key={slug}
                    to={`/search?category=${encodeURIComponent(slug)}`}
                    className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    {t(`categories.${slug}.name`)}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-6 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap sm:mt-8"
            >
              <Link
                to="/search"
                className="btn btn-primary btn-lg w-full justify-center gap-2 shadow-warm min-[400px]:w-auto rtl:flex-row-reverse"
              >
                {t("home.heroCta")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Link>
              <Link
                to="/equipment/new"
                className="btn btn-secondary btn-lg w-full justify-center min-[400px]:w-auto"
              >
                {t("home.heroListCta")}
              </Link>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4"
            >
              {trustPillKeys.map(({ icon: Icon, key }) => (
                <li
                  key={key}
                  className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-100/80 px-3 py-2.5 text-sm text-stone-700"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas-card shadow-elevated ring-1 ring-stone-200">
                    <Icon className="h-4 w-4 text-brand-600" strokeWidth={2} />
                  </span>
                  <span className="font-medium">{t(key)}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:justify-self-end">
            <div
              className="pointer-events-none absolute inset-4 rounded-[2rem] bg-gradient-to-br from-brand-100/80 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              {showcaseItemDefs.map((item) => (
                <motion.article
                  key={item.titleKey}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: item.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "group rounded-2xl border border-white/90 bg-gradient-to-br p-4 shadow-lg shadow-stone-900/5 ring-1 ring-stone-100/80 backdrop-blur-sm sm:p-5",
                    item.accent,
                    item.className
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-canvas-card/90 shadow-sm ring-1 ring-stone-200">
                    <item.icon className="h-5 w-5 text-stone-800" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-semibold text-stone-900 sm:text-base">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-brand-500 sm:text-sm">
                    {t("common.perDay", { price: item.price })}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-brand-500">
                    <MapPin className="h-3 w-3 shrink-0 text-brand-500" aria-hidden />
                    {t(item.locationKey)}
                  </p>
                </motion.article>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-stone-200 bg-canvas-card px-4 py-2 shadow-elevated sm:-bottom-4"
            >
              <CalendarCheck className="h-4 w-4 text-brand-500" aria-hidden />
              <span className="whitespace-nowrap text-xs font-semibold text-stone-800 sm:text-sm">
                {t("home.bookQuick")}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
