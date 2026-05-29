import { Package } from "lucide-react";
import { cn } from "@/utils/cn";

interface CategoryIconProps {
  iconUrl?: string | null;
  name?: string;
  className?: string;
  imgClassName?: string;
}

export function CategoryIcon({
  iconUrl,
  name,
  className,
  imgClassName,
}: CategoryIconProps) {
  if (iconUrl?.trim()) {
    return (
      <img
        src={iconUrl}
        alt={name ? `${name} icon` : ""}
        className={cn("object-contain", imgClassName ?? className)}
      />
    );
  }
  return <Package className={className} strokeWidth={1.75} aria-hidden />;
}
