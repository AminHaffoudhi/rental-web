import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
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
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/utils/cn";

type FormValues = {
  email: string;
  password: string;
};

function createLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().email(t("auth.invalidEmail")),
    password: z.string().min(1, t("auth.passwordRequired")),
  });
}

export function Login() {
  const { t } = useTranslation();
  const isRtl = useLocaleStore((s) => s.language === "ar");
  const schema = useMemo(() => createLoginSchema(t), [t]);

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
      if (code === "ACCOUNT_BLOCKED") {
        clearAuth();
        setApiError(t("auth.blockedAccount"));
        return;
      }
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-canvas lg:flex-row">
      <AuthBrandPanel variant="login" />

      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-end gap-2 border-b border-stone-200 bg-canvas-card px-4 py-4 sm:px-6 lg:hidden">
          <ThemeToggle />
          <Link
            to="/"
            className="text-sm font-medium text-stone-500 hover:text-brand-600"
          >
            {t("common.home")}
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-brand-50/40 via-canvas to-canvas-card px-4 py-10 sm:px-6 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            dir={isRtl ? "rtl" : "ltr"}
            className="auth-form w-full max-w-[420px]"
          >
            <div className="mb-6 flex justify-center lg:hidden">
              <PlatformLogo size="3xl" centered />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-elevated sm:p-8 sm:rounded-3xl">
              <div className="auth-form-heading mb-8 text-start">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  {t("auth.welcomeBack")}
                </h2>
                <p className="mt-2 text-sm text-stone-500 sm:text-base">
                  {t("auth.signInNewHere")}{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
                  >
                    {t("auth.signInCreateAccount")}
                  </Link>
                </p>
              </div>

              {registeredEmail ? (
                <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3.5 text-sm text-brand-900 text-start">
                  <p>{t("auth.verifyEmailSent", { email: registeredEmail })}</p>
                  <Link
                    to="/verify-email"
                    state={{ email: registeredEmail }}
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
                  >
                    {t("auth.goToVerification")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
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
                        <FormLabel className="text-stone-700">{t("auth.email")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail
                              className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                              aria-hidden
                            />
                            <input
                              type="email"
                              autoComplete="email"
                              placeholder={t("auth.emailPlaceholder")}
                              dir="ltr"
                              className="input ps-10"
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
                        <div className="grid w-full gap-1 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-2">
                          <FormLabel className="text-stone-700">{t("auth.password")}</FormLabel>
                          <span
                            className="text-xs font-medium text-stone-400 sm:justify-self-end"
                            title={t("auth.comingSoon")}
                          >
                            {t("auth.forgotPassword")}
                          </span>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                              aria-hidden
                            />
                            <input
                              type={showPw ? "text" : "password"}
                              autoComplete="current-password"
                              placeholder="••••••••"
                              dir="ltr"
                              className="input ps-10 pe-11"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                              onClick={() => setShowPw((s) => !s)}
                              aria-label={showPw ? t("auth.hidePassword") : t("auth.showPassword")}
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
                        {t("auth.signInButton")}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                      </>
                    )}
                  </button>
                </form>
              </Form>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-stone-400">
              {t("auth.signInAgreePrefix")}{" "}
              <Link
                to="/terms"
                className="font-semibold text-stone-500 underline-offset-2 hover:text-brand-600 hover:underline"
              >
                {t("footer.terms")}
              </Link>{" "}
              {t("auth.signInAgreeAnd")}{" "}
              <Link
                to="/privacy"
                className="font-semibold text-stone-500 underline-offset-2 hover:text-brand-600 hover:underline"
              >
                {t("footer.privacy")}
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
