import { CalendarCheck, Search, Truck } from "lucide-react";
import { SectionHeading, SectionReveal } from "@/components/home/SectionReveal";
import { cn } from "@/utils/cn";

const steps = [
  {
    icon: Search,
    title: "Search & filter",
    body: "Browse thousands of listings. Filter by category, location, and price.",
  },
  {
    icon: CalendarCheck,
    title: "Book & pay",
    body: "Request a booking. Owner approves. Pay securely with deposit held.",
  },
  {
    icon: Truck,
    title: "Receive & return",
    body: "We deliver to you. Use it. Return it. Deposit refunded.",
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section className="py-14 sm:py-16 md:py-20 lg:py-24">
      <SectionReveal className="container">
        <SectionHeading
          eyebrow="How it works"
          title="Renting is simple"
          subtitle="Three steps to get the equipment you need"
        />

        <div className="relative mx-auto mt-12 max-w-5xl lg:mt-16">
          <div
            className="absolute left-[1.65rem] top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-brand-200 via-brand-300 to-transparent md:hidden"
            aria-hidden
          />

          <ol className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-6 lg:gap-10">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={cn(
                  "relative flex flex-1 flex-col md:items-center md:text-center",
                  "pl-14 md:pl-0"
                )}
              >
                <div className="absolute left-0 top-0 flex md:relative md:mb-6 md:justify-center">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-warm md:h-16 md:w-16 md:rounded-full">
                    <step.icon className="h-5 w-5 md:h-7 md:w-7" strokeWidth={2} />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-canvas-card text-xs font-bold text-brand-600 shadow-elevated ring-2 ring-brand-100 md:hidden">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <span
                  className="pointer-events-none absolute -top-2 right-0 hidden font-display text-6xl font-semibold text-brand-100 md:block lg:text-7xl"
                  aria-hidden
                >
                  {index + 1}
                </span>

                <h3 className="font-display text-lg font-semibold text-stone-900 sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500 md:mx-auto md:mt-3">
                  {step.body}
                </p>

                {index < steps.length - 1 ? (
                  <div
                    className="absolute -bottom-5 left-6 hidden h-10 w-px bg-brand-200 md:hidden"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>

          <div
            className="mt-10 hidden items-center justify-center gap-2 md:flex"
            aria-hidden
          >
            {steps.map((_, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-400" />
                {i < steps.length - 1 ? (
                  <span className="h-px w-12 bg-brand-200 lg:w-20" />
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
