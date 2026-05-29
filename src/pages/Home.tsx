import { Link } from "react-router-dom";
import {
  BadgeCheck,
  CalendarCheck,
  Check,
  Drill,
  PackageSearch,
  Rocket,
  Search,
  Shield,
  Star,
  Tent,
  Trophy,
  Truck,
  Wrench,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import { ALL_CATEGORY_FILTER, buildCategoryFilters } from "@/config/categories";
import { CategoryIcon } from "@/components/equipment/CategoryIcon";
import { useCategories } from "@/hooks/useCategories";
import { useEquipmentList } from "@/hooks/useEquipment";
import { cn } from "@/utils/cn";

const heroMiniCards = [
  {
    bg: "bg-brand-100",
    icon: Drill,
    title: "Construction Drill",
    price: "45 TND/day",
    rotate: "-rotate-3",
    delay: 0,
  },
  {
    bg: "bg-green-50",
    icon: Trophy,
    title: "Football Goals",
    price: "30 TND/day",
    rotate: "rotate-2",
    delay: 0.08,
  },
  {
    bg: "bg-blue-50",
    icon: Tent,
    title: "Party Tent",
    price: "80 TND/day",
    rotate: "-rotate-1",
    delay: 0.16,
  },
  {
    bg: "bg-purple-50",
    icon: Wrench,
    title: "Power Tools Set",
    price: "35 TND/day",
    rotate: "rotate-3",
    delay: 0.24,
  },
] as const;

const stats = [
  { value: "2,400+", label: "Listings" },
  { value: "1,800+", label: "Owners" },
  { value: "12,000+", label: "Rentals" },
  { value: "4.9", label: "Rating", showStar: true },
] as const;

const steps = [
  {
    icon: Search,
    title: "Search & Filter",
    body: "Browse thousands of listings. Filter by category, location, and price.",
  },
  {
    icon: CalendarCheck,
    title: "Book & Pay",
    body: "Request a booking. Owner approves. Pay securely with deposit held.",
  },
  {
    icon: Truck,
    title: "Receive & Return",
    body: "We deliver to you. Use it. Return it. Deposit refunded.",
  },
] as const;

const gridContainerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function SectionReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Home() {
  const { equipment, isLoading, error, refetch } = useEquipmentList({ limit: 6 });
  const { categories } = useCategories();
  const homepageCategories = [
    ...buildCategoryFilters(categories).filter((c) => c.value !== ALL_CATEGORY_FILTER.value),
    ALL_CATEGORY_FILTER,
  ];

  const showFeaturedEmpty = !isLoading && (error || equipment.length === 0);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative border-b border-stone-100">
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-50 to-white"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(rgb(214 211 209) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />

        <div className="relative container pt-10 pb-0 md:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold text-brand-700">
                <Rocket className="h-3.5 w-3.5" aria-hidden />
                Now available in Tunisia
              </span>
              <h1 className="font-display text-balance text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl lg:text-[3rem] lg:leading-[1.1]">
                Rent Any <span className="text-brand-500">Equipment</span>,
                <br />
                Anywhere.
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-500">
                Connect with trusted local owners. Rent construction gear, sports equipment, event
                supplies and more — by the day.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link to="/search" className="btn btn-primary btn-xl justify-center">
                  Browse Equipment
                </Link>
                <Link to="/equipment/new" className="btn btn-secondary btn-xl justify-center">
                  List Your Gear
                </Link>
              </div>
              <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
                <li className="flex items-center gap-2 text-[13px] text-stone-600">
                  <Check className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.5} />
                  Verified owners
                </li>
                <li className="flex items-center gap-2 text-[13px] text-stone-600">
                  <Check className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.5} />
                  Secure deposits
                </li>
                <li className="flex items-center gap-2 text-[13px] text-stone-600">
                  <Check className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.5} />
                  Delivery included
                </li>
              </ul>
            </div>

            <div className="relative mx-auto flex min-h-[320px] w-full max-w-[400px] items-center justify-center lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {heroMiniCards.map((card) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: card.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "w-[160px] rounded-xl border border-white/80 shadow-lg sm:w-[180px]",
                      card.bg,
                      card.rotate
                    )}
                  >
                    <div className="flex flex-col gap-2 p-4">
                      <card.icon
                        className="h-10 w-10 text-stone-700"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <p className="font-display text-sm font-semibold text-stone-900">
                        {card.title}
                      </p>
                      <p className="text-xs font-medium text-stone-600">{card.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-12 border-y border-stone-100 bg-white">
          <div className="container py-8">
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:flex md:gap-0">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    "flex flex-col items-center text-center md:flex-1 md:border-l md:border-stone-100 md:px-8",
                    i === 0 && "md:border-l-0"
                  )}
                >
                  {"showStar" in s && s.showStar ? (
                    <p className="flex items-center justify-center gap-1 font-display text-2xl font-semibold text-stone-900">
                      <span>{s.value}</span>
                      <Star
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                        aria-hidden
                      />
                    </p>
                  ) : (
                    <p className="font-display text-2xl font-semibold text-stone-900">{s.value}</p>
                  )}
                  <p className="mt-1 text-sm text-stone-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Category grid ── */}
      <section className="section bg-warm">
        <SectionReveal className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-stone-900 md:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-3 text-stone-500">
              Find exactly what you need across our growing catalog
            </p>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={gridContainerVariants}
          >
            {homepageCategories.map((cat) => {
              const iconUrl = "iconUrl" in cat ? cat.iconUrl : undefined;
              const description =
                "description" in cat && cat.description
                  ? cat.description
                  : cat.value === ALL_CATEGORY_FILTER.value
                    ? "Browse everything in our catalog"
                    : "Explore listings in this category";
              return (
                <motion.div key={cat.value} variants={gridItemVariants}>
                  <Link
                    to={
                      cat.value === ALL_CATEGORY_FILTER.value
                        ? "/search"
                        : `/search?category=${encodeURIComponent(cat.value)}`
                    }
                    className={cn(
                      "group flex flex-col items-center rounded-2xl border border-stone-100 bg-white p-8 text-center shadow-sm transition-all duration-300",
                      "hover:-translate-y-1 hover:border-brand-200 hover:bg-brand-50 hover:shadow-lg"
                    )}
                  >
                    <span
                      className={cn(
                        "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-stone-100",
                        "color" in cat && cat.color ? cat.color : "bg-stone-50 text-stone-700"
                      )}
                      aria-hidden
                    >
                      {cat.value === ALL_CATEGORY_FILTER.value && cat.icon ? (
                        <cat.icon className="h-7 w-7" strokeWidth={1.75} />
                      ) : (
                        <CategoryIcon
                          iconUrl={iconUrl}
                          name={cat.label}
                          className="h-7 w-7"
                          imgClassName="h-8 w-8"
                        />
                      )}
                    </span>
                    <h4 className="font-display text-lg font-semibold text-stone-900">{cat.label}</h4>
                    <p className="mt-2 line-clamp-2 text-sm text-stone-500">{description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </SectionReveal>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <SectionReveal className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-stone-900 md:text-4xl">
              Renting is Simple
            </h2>
            <p className="mt-3 text-stone-500">Three steps to get the equipment you need</p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-start md:justify-center">
              {steps.flatMap((step, index) => {
                const block = (
                  <div
                    key={step.title}
                    className="flex flex-1 flex-col items-center px-2 text-center md:min-w-0"
                  >
                    <div className="relative mb-6 flex h-24 w-full items-center justify-center">
                      <span
                        className="pointer-events-none absolute font-display text-[64px] font-semibold leading-none text-brand-100"
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 shadow-sm ring-4 ring-white">
                        <step.icon className="h-7 w-7 text-brand-500" strokeWidth={2} />
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-stone-900">{step.title}</h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-500">{step.body}</p>
                  </div>
                );

                if (index >= steps.length - 1) return [block];

                const connector = (
                  <div
                    key={`step-dash-${index}`}
                    className="hidden shrink-0 items-center self-start pt-12 md:flex"
                    aria-hidden
                  >
                    <div className="h-0 w-10 border-t-2 border-dashed border-brand-200 lg:w-16 xl:w-24" />
                  </div>
                );

                return [block, connector];
              })}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ── Featured ── */}
      <section className="section bg-warm">
        <SectionReveal className="container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-semibold text-stone-900 md:text-4xl">
              Recently Listed
            </h2>
            <Link
              to="/search"
              className="font-semibold text-brand-500 transition-colors hover:text-brand-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          {showFeaturedEmpty ? (
            <EmptyState
              icon={PackageSearch}
              title={error ? "Couldn’t load listings" : "No listings yet"}
              subtitle={
                error
                  ? error.message
                  : "Check back soon — new gear is added every day."
              }
              action={
                error ? { label: "Try again", onClick: () => void refetch() } : undefined
              }
            />
          ) : (
            <EquipmentGrid equipment={equipment} isLoading={isLoading} />
          )}
        </SectionReveal>
      </section>

      {/* ── Trust ── */}
      <section className="border-t border-stone-800 bg-stone-900 py-16 md:py-24">
        <SectionReveal className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
            <blockquote className="font-display text-2xl italic leading-relaxed text-white md:text-3xl">
              “I rented a concrete mixer for a weekend project. The process was seamless and the owner
              was incredibly helpful.”
              <footer className="mt-6 font-body text-base not-italic text-stone-400">
                — Ahmed B., Tunis
              </footer>
            </blockquote>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-stone-700 p-6 text-white shadow-lg">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Shield className="h-5 w-5 shrink-0 text-brand-300" aria-hidden />
                  Secure Deposits
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  Your deposit is held safely until return confirmed
                </p>
              </div>
              <div className="rounded-2xl bg-stone-700 p-6 text-white shadow-lg">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-brand-300" aria-hidden />
                  Verified Owners
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  Every owner is KYC verified before listing
                </p>
              </div>
              <div className="rounded-2xl bg-stone-700 p-6 text-white shadow-lg">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Truck className="h-5 w-5 shrink-0 text-brand-300" aria-hidden />
                  Delivery Included
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  Equipment delivered and picked up from your door
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-brand-600 bg-gradient-to-br from-brand-500 to-brand-600 py-16 md:py-20">
        <SectionReveal className="container text-center">
          <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
            Have equipment sitting idle?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            List it on RentMarket and earn money from your tools, gear, and machinery.
          </p>
          <Link
            to="/equipment/new"
            className="btn btn-xl mt-8 inline-flex bg-white font-semibold text-brand-600 shadow-md hover:bg-brand-50"
          >
            Start Listing →
          </Link>
          <p className="mt-6 text-sm text-white/70">
            Free to list • No subscription • Pay only when you earn
          </p>
        </SectionReveal>
      </section>
    </div>
  );
}
