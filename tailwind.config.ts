import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--color-brand-50)",
          100: "var(--color-brand-100)",
          200: "var(--color-brand-200)",
          300: "var(--color-brand-300)",
          400: "var(--color-brand-400)",
          500: "var(--color-brand-500)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
          800: "var(--color-brand-800)",
          900: "var(--color-brand-900)",
        },
        stone: {
          50: "var(--color-stone-50)",
          100: "var(--color-stone-100)",
          200: "var(--color-stone-200)",
          300: "var(--color-stone-300)",
          400: "var(--color-stone-400)",
          500: "var(--color-stone-500)",
          600: "var(--color-stone-600)",
          700: "var(--color-stone-700)",
          800: "var(--color-stone-800)",
          900: "var(--color-stone-900)",
          inv: "var(--color-stone-inv)",
        },
        canvas: {
          DEFAULT: "var(--canvas)",
          card: "var(--canvas-card)",
          elevated: "var(--canvas-elevated)",
          inverse: "var(--canvas-inverse)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          disabled: "var(--ink-disabled)",
          inverse: "var(--ink-on-inverse)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        warm: "0 4px 24px rgba(249,115,22,0.15)",
        elevated: "var(--shadow-elevated)",
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        fadeIn: "fadeIn 0.4s ease both",
        slideUp: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        scaleIn: "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
        wiggle: "wiggle 0.5s ease-in-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-15deg)" },
          "75%": { transform: "rotate(15deg)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
