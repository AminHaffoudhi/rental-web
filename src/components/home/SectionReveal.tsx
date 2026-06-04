import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-balance text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base leading-relaxed text-stone-500 sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
