import { Link } from "react-router-dom";
import logoSrc from "@/assets/logo.png";
import logoArSrc from "@/assets/logoar.png";
import { PLATFORM_NAME } from "@/config/brand";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/utils/cn";

/** Default (Latin) logo — height by size token */
const sizeClasses = {
  xs: "h-8",
  sm: "h-10",
  md: "h-12",
  lg: "h-16",
  xl: "h-20",
  "2xl": "h-24",
  "3xl": "h-28 sm:h-32",
} as const;

/** Arabic wordmark logo is wider — slightly taller + max width */
const sizeClassesAr = {
  xs: "h-9 max-w-[100px]",
  sm: "h-11 max-w-[130px]",
  md: "h-14 max-w-[150px] sm:max-w-[170px]",
  lg: "h-16 max-w-[190px] sm:max-w-[220px]",
  xl: "h-20 max-w-[240px]",
  "2xl": "h-24 max-w-[280px]",
  "3xl": "h-28 max-w-[300px] sm:h-32 sm:max-w-[360px]",
} as const;

export type PlatformLogoSize = keyof typeof sizeClasses;

type PlatformLogoProps = {
  size?: PlatformLogoSize;
  /** Show "Ekri" text beside the image (use when the PNG is icon-only) */
  showWordmark?: boolean;
  /** White wordmark for dark / brand-colored backgrounds */
  inverseWordmark?: boolean;
  linkTo?: string | false;
  /** White monochrome mark on brand/dark backgrounds (Latin logo only; Arabic logo stays full-color) */
  onDarkBackground?: boolean;
  /** Center logo in its container (auth panels, mobile headers) */
  centered?: boolean;
  className?: string;
  imgClassName?: string;
  wordmarkClassName?: string;
};

export function PlatformLogo({
  size = "md",
  showWordmark = false,
  inverseWordmark = false,
  linkTo = "/",
  onDarkBackground = false,
  centered = false,
  className,
  imgClassName,
  wordmarkClassName,
}: PlatformLogoProps) {
  const language = useLocaleStore((s) => s.language);
  const isArabic = language === "ar";
  const src = isArabic ? logoArSrc : logoSrc;
  const alt = isArabic ? `${PLATFORM_NAME} — شعار` : PLATFORM_NAME;

  const image = (
    <img
      src={src}
      alt={alt}
      className={cn(
        "w-auto shrink-0 object-contain",
        centered ? "object-center" : "object-start",
        isArabic ? sizeClassesAr[size] : sizeClasses[size],
        onDarkBackground && !isArabic && "brightness-0 invert",
        onDarkBackground && isArabic && "drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
        imgClassName
      )}
    />
  );

  const wordmark =
    showWordmark && !isArabic ? (
      <span
        className={cn(
          "font-display font-semibold tracking-tight",
          size === "2xl" || size === "xl"
            ? "text-2xl sm:text-3xl"
            : size === "lg"
              ? "text-lg"
              : "text-base",
          inverseWordmark ? "text-white" : "text-brand-600",
          wordmarkClassName
        )}
      >
        {PLATFORM_NAME}
      </span>
    ) : null;

  const content = (
    <>
      {image}
      {wordmark}
    </>
  );

  const wrapperClass = cn(
    "inline-flex items-center gap-2.5",
    centered && "w-full justify-center",
    className
  );

  if (linkTo === false) {
    return <span className={wrapperClass}>{content}</span>;
  }

  return (
    <Link to={linkTo} className={wrapperClass}>
      {content}
    </Link>
  );
}
