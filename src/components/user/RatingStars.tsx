import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

interface RatingStarsProps {
  rating: number;
  size?: "xs" | "sm" | "md";
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export function RatingStars({
  rating,
  size = "md",
  interactive = false,
  onChange,
}: RatingStarsProps) {
  const starClass =
    size === "xs" ? "h-3 w-3" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={cn(
            interactive ? "cursor-pointer" : "cursor-default",
            "text-amber-500",
            n <= rating ? "opacity-100" : "opacity-30"
          )}
        >
          <Star className={cn(starClass, "fill-current")} />
        </button>
      ))}
    </div>
  );
}
