import { BadgeCheck, Quote, Shield, Star, Truck } from "lucide-react";
import { SectionReveal } from "@/components/home/SectionReveal";
import { cn } from "@/utils/cn";

const features = [
  {
    icon: Shield,
    title: "Secure deposits",
    body: "Your deposit is held safely until the return is confirmed.",
  },
  {
    icon: BadgeCheck,
    title: "Verified owners",
    body: "Every owner completes KYC before listing equipment.",
  },
  {
    icon: Truck,
    title: "Delivery included",
    body: "Equipment delivered and picked up from your door.",
  },
] as const;

export function HomeTrust() {
  return (
    <section className="py-14 sm:py-16 md:py-20 lg:py-24">
      <SectionReveal className="container">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-canvas-card shadow-elevated">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative border-b border-stone-200 bg-gradient-to-br from-brand-50 via-canvas-card to-canvas-card p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <Quote
                className="absolute right-6 top-6 h-16 w-16 text-brand-100 sm:h-20 sm:w-20"
                aria-hidden
              />
              <div className="relative">
                <div className="mb-4 flex gap-0.5" aria-hidden>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="font-display text-xl font-medium leading-snug text-stone-900 sm:text-2xl lg:text-[1.65rem] lg:leading-relaxed">
                  I rented a concrete mixer for a weekend project. The process was seamless and
                  the owner was incredibly helpful.
                </blockquote>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 font-semibold text-white">
                    AB
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Ahmed B.</p>
                    <p className="text-sm text-stone-500">Tunis · Renter</p>
                  </div>
                </footer>
              </div>
            </div>

            <div className="grid gap-px bg-stone-100 sm:grid-cols-1">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={cn(
                    "flex gap-4 bg-canvas-card p-6 sm:p-8",
                    i > 0 && "border-t border-stone-200 sm:border-t"
                  )}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <f.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-stone-900 sm:text-lg">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
