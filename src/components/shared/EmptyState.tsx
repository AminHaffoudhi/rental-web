import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  /** @deprecated Prefer `subtitle` */
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  description,
  action,
}: EmptyStateProps) {
  const body = subtitle ?? description ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
        <Icon className="h-16 w-16 text-brand-200 dark:text-brand-500/50" aria-hidden />
      </div>
      <h3 className="font-display text-xl font-semibold text-stone-900 md:text-2xl">{title}</h3>
      <p className="max-w-sm text-sm text-stone-500">{body}</p>
      {action ? (
        <button type="button" className="btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </motion.div>
  );
}
