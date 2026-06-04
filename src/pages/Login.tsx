import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorDetail } from "@/services/api";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { PLATFORM_NAME } from "@/config/brand";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const perks = [
  { icon: BadgeCheck, text: "Verified local owners" },
  { icon: Shield, text: "Secure deposit handling" },
  { icon: Truck, text: "Delivery included" },
] as const;

export function Login() {
  const { login } = useAuth();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail =
    (location.state as { registeredEmail?: string; email?: string } | null)?.registeredEmail ??
    (location.state as { email?: string } | null)?.email ??
    null;

  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setApiError(null);
    setLoading(true);
    try {
      await login(values);
    } catch (e) {
      const { message, code } = getApiErrorDetail(e);
      if (code === "EMAIL_NOT_VERIFIED") {
        clearAuth();
        navigate("/verify-email", { replace: true, state: { email: values.email } });
        return;
      }
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-canvas lg:flex-row">
      {/* Brand panel — desktop */}
      <aside className="relative hidden w-full max-w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 px-10 py-12 text-white xl:px-14 xl:py-16 lg:flex">
        <div
          className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden
        />

        <div className="relative z-[1]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
          <div className="mt-10">
            <PlatformLogo size="2xl" linkTo="/" className="brightness-0 invert" />
          </div>
        </div>

        <div className="relative z-[1]">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight xl:text-[2.35rem]">
            Welcome back to Tunisia&apos;s equipment marketplace
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">
            Sign in to manage bookings, list your gear, and connect with trusted renters and owners.
          </p>
          <ul className="mt-10 space-y-4">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                  <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                <span className="text-sm font-medium sm:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-[1] text-sm text-white/60">
          © {new Date().getFullYear()} {PLATFORM_NAME} · Built for Tunisia
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stone-200 bg-canvas-card px-4 py-4 sm:px-6 lg:hidden">
          <PlatformLogo size="sm" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              className="text-sm font-medium text-stone-500 hover:text-brand-600"
            >
              Home
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-brand-50/40 via-canvas to-canvas-card px-4 py-10 sm:px-6 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[420px]"
          >
            <div className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-elevated sm:p-8 sm:rounded-3xl">
              <div className="mb-8">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  Sign in
                </h2>
                <p className="mt-2 text-sm text-stone-500 sm:text-base">
                  New here?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              {registeredEmail ? (
                <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3.5 text-sm text-brand-900">
                  <p>
                    We sent a 6-digit code to <strong>{registeredEmail}</strong>. Verify your email
                    to continue.
                  </p>
                  <Link
                    to="/verify-email"
                    state={{ email: registeredEmail }}
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
                  >
                    Go to verification
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {apiError ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      role="alert"
                    >
                      {apiError}
                    </motion.div>
                  ) : null}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stone-700">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail
                              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                              aria-hidden
                            />
                            <input
                              type="email"
                              autoComplete="email"
                              placeholder="you@example.com"
                              className="input pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormLabel className="text-stone-700">Password</FormLabel>
                          <span
                            className="cursor-not-allowed text-xs font-medium text-stone-400"
                            title="Coming soon"
                          >
                            Forgot password?
                          </span>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                              aria-hidden
                            />
                            <input
                              type={showPw ? "text" : "password"}
                              autoComplete="current-password"
                              placeholder="••••••••"
                              className="input pl-10 pr-11"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                              onClick={() => setShowPw((s) => !s)}
                              aria-label={showPw ? "Hide password" : "Show password"}
                            >
                              {showPw ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "btn btn-primary btn-lg relative mt-2 w-full gap-2 shadow-warm",
                      loading && "pointer-events-none opacity-90"
                    )}
                  >
                    {loading ? (
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </Form>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-stone-400">
              By signing in you agree to our{" "}
              <Link
                to="/terms"
                className="font-semibold text-stone-500 underline-offset-2 hover:text-brand-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-semibold text-stone-500 underline-offset-2 hover:text-brand-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>

            {/* Mobile perks */}
            <ul className="mt-8 flex flex-wrap justify-center gap-3 lg:hidden">
              {perks.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-canvas-card px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
