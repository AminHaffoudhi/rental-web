import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SectionHeading, SectionReveal } from "@/components/home/SectionReveal";
import { CategoryIcon } from "@/components/equipment/CategoryIcon";
import { ALL_CATEGORY_FILTER } from "@/config/categories";
import { localizedCategory } from "@/i18n/categoryLocale";
import { cn } from "@/utils/cn";

type CategoryFilterItem = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }> | null;
  iconUrl?: string;
  color?: string;
  description?: string;
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function categoryHref(cat: CategoryFilterItem): string {
  if (cat.value === ALL_CATEGORY_FILTER.value) return "/search";
  return `/search?category=${encodeURIComponent(cat.value)}`;
}

function CategoryCard({ cat }: { cat: CategoryFilterItem }) {
  const { t } = useTranslation();
  const iconUrl = "iconUrl" in cat ? cat.iconUrl : undefined;

  const localized =
    cat.value !== ALL_CATEGORY_FILTER.value
      ? localizedCategory(cat.value, {
          name: cat.label,
          description: "description" in cat ? cat.description : undefined,
        }, t)
      : null;

  const label =
    cat.value === ALL_CATEGORY_FILTER.value
      ? t("home.categoriesAll")
      : (localized?.name ?? cat.label);
  const description =
    cat.value === ALL_CATEGORY_FILTER.value
      ? t("home.categoriesBrowseAll")
      : localized?.description?.trim()
        ? localized.description
        : t("home.categoriesExplore");

  return (
    <Link
      to={categoryHref(cat)}
      className={cn(
        "group relative flex h-full min-w-[240px] flex-col rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-elevated",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg",
        "sm:min-w-0"
      )}
    >
      <span
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-stone-100 transition-transform duration-300 group-hover:scale-105",
          "color" in cat && cat.color ? cat.color : "bg-stone-50 text-stone-700"
        )}
        aria-hidden
      >
        {cat.value === ALL_CATEGORY_FILTER.value && cat.icon ? (
          <cat.icon className="h-6 w-6" strokeWidth={1.75} />
        ) : (
          <CategoryIcon
            iconUrl={iconUrl}
            name={cat.label}
            className="h-6 w-6"
            imgClassName="h-7 w-7"
          />
        )}
      </span>
      <h3 className="font-display text-lg font-semibold text-stone-900">{label}</h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-500">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
        {t("common.explore")}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </span>
    </Link>
  );
}

export function HomeCategories({ categories }: { categories: CategoryFilterItem[] }) {
  const { t } = useTranslation();
  const items = [
    ...categories.filter((c) => c.value !== ALL_CATEGORY_FILTER.value),
    ALL_CATEGORY_FILTER,
  ];

  return (
    <section className="border-y border-stone-200 bg-gradient-to-b from-brand-50/50 to-canvas-card py-14 sm:py-16 md:py-20 lg:py-24 dark:from-brand-500/10 dark:to-canvas">
      <SectionReveal className="container">
        <SectionHeading
          eyebrow={t("home.categoriesEyebrow")}
          title={t("home.categoriesTitle")}
          subtitle={t("home.categoriesSubtitle")}
        />

        <div className="mt-10 md:hidden">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {items.map((cat) => (
              <motion.div
                key={cat.value}
                className="w-[78%] shrink-0 snap-center sm:w-[55%]"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
              >
                <CategoryCard cat={cat} />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-10 hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={gridVariants}
        >
          {items.map((cat) => (
            <motion.div key={cat.value} variants={itemVariants} className="h-full">
              <CategoryCard cat={cat} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center md:mt-10">
          <Link
            to="/search"
            className="btn btn-secondary inline-flex gap-2"
          >
            {t("home.categoriesExploreAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionReveal>
    </section>
  );
}
