import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/utils/cn";

type ThemeToggleProps = {
  className?: string;
  /** Compact icon-only for navbar */
  variant?: "icon" | "pill";
};

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-stone-200 bg-canvas-card px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors",
          "hover:border-brand-500/40 hover:text-brand-500",
          className
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        {isDark ? "Light" : "Dark"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-colors",
        "hover:bg-stone-100 hover:text-stone-900",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
