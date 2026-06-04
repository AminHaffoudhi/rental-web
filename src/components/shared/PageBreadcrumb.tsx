import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

export type BreadcrumbItem = {
  label: string;
  to?: string;
  /** First item shows home icon when true */
  home?: boolean;
};

type PageBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1 text-sm text-stone-500 dark:text-stone-400",
        className
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? (
              <ChevronRight
                className="h-4 w-4 shrink-0 opacity-40 rtl:rotate-180"
                aria-hidden
              />
            ) : null}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="inline-flex max-w-[12rem] items-center gap-1 truncate font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400 sm:max-w-xs"
              >
                {item.home ? <Home className="h-4 w-4 shrink-0" aria-hidden /> : null}
                <span className="truncate">{item.label}</span>
              </Link>
            ) : (
              <span
                className={cn(
                  "line-clamp-1 max-w-[14rem] font-medium sm:max-w-md",
                  isLast ? "text-stone-700 dark:text-stone-200" : "text-stone-500"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
