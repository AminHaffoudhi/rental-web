import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorDetail } from "@/services/api";
import { TermsAcceptanceModal } from "@/components/legal/TermsAcceptanceModal";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { PLATFORM_NAME } from "@/config/brand";
import { cn } from "@/utils/cn";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  role: "RENTER" | "OWNER" | "BOTH";
  acceptTerms: boolean;
};

function createRegisterSchema(t: (key: string) => string) {
  return z
    .object({
      name: z.string().min(1, t("auth.nameRequired")),
      email: z.string().email(t("auth.invalidEmail")),
      phone: z
        .string()
        .trim()
        .min(8, t("auth.phoneRequired"))
        .max(30, t("auth.phoneTooLong")),
      password: z.string().min(8, t("auth.passwordMin")),
      confirm: z.string().min(8),
      role: z.enum(["RENTER", "OWNER", "BOTH"]),
      acceptTerms: z.boolean().refine((v) => v === true, {
        message: t("auth.termsRequired"),
      }),
    })
    .refine((data) => data.password === data.confirm, {
      message: t("auth.passwordMatch"),
      path: ["confirm"],
    });
}

function passwordStrength(
  pw: string,
  labels: [string, string, string, string]
): { level: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const level = Math.min(4, Math.floor(score * 0.8));
  return { level: Math.max(1, level), label: labels[Math.min(3, Math.max(0, level - 1))] };
}

export function Register() {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const schema = useMemo(() => createRegisterSchema(t), [t]);
  const strengthLabels = useMemo(
    () =>
      [
        t("auth.passwordStrengthWeak"),
        t("auth.passwordStrengthFair"),
        t("auth.passwordStrengthGood"),
        t("auth.passwordStrengthStrong"),
      ] as [string, string, string, string],
    [t]
  );
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsReviewed, setTermsReviewed] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
      role: "RENTER",
      acceptTerms: false,
    },
  });

  const pw = form.watch("password");
  const strength = useMemo(() => passwordStrength(pw || "", strengthLabels), [pw, strengthLabels]);

  async function onSubmit(values: FormValues) {
    setApiError(null);
    setLoading(true);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone.trim(),
        role: values.role,
      });
    } catch (e) {
      setApiError(getApiErrorDetail(e).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <div className="relative hidden w-[40%] flex-col justify-center overflow-hidden bg-brand-600 px-12 py-16 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
          aria-hidden
        />
        <div className="relative z-[1]">
          <PlatformLogo size="2xl" linkTo="/" className="brightness-0 invert" />
          <p className="mt-6 max-w-sm text-lg text-white/90">{t("auth.registerSidebar")}</p>
          <ul className="mt-10 space-y-3 text-white/80">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
              {t("auth.registerBulletListings")}
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
              {t("auth.registerBulletDeposits")}
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
              {t("auth.registerBulletDelivery")}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-canvas px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <PlatformLogo size="md" className="mb-6 lg:hidden" />
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              {t("auth.createAccountTitle")}
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              {t("auth.loginPrompt")}{" "}
              <Link to="/login" className="font-semibold text-brand-600 hover:underline">
                {t("auth.loginLink")} →
              </Link>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {apiError ? (
                <motion.div
                  initial={{ x: [0, -8, 8, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:text-red-300"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {apiError}
                </motion.div>
              ) : null}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <FormItem>
                      <FormLabel>{t("auth.name")}</FormLabel>
                      <FormControl>
                        <input className="input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </motion.div>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <FormItem>
                      <FormLabel>{t("auth.email")}</FormLabel>
                      <FormControl>
                        <input type="email" autoComplete="email" className="input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </motion.div>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FormItem>
                      <FormLabel>
                        {t("auth.phone")} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          type="tel"
                          autoComplete="tel"
                          placeholder={t("auth.phonePlaceholder")}
                          className="input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </motion.div>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                  >
                    <FormItem>
                      <FormLabel>{t("auth.password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type={showPw ? "text" : "password"}
                            autoComplete="new-password"
                            className="input pe-11"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            onClick={() => setShowPw((s) => !s)}
                            aria-label={showPw ? t("auth.hidePassword") : t("auth.showPassword")}
                          >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full bg-stone-200 transition-colors",
                              i < strength.level &&
                                (strength.level <= 1
                                  ? "bg-red-500"
                                  : strength.level === 2
                                    ? "bg-orange-500"
                                    : strength.level === 3
                                      ? "bg-yellow-500"
                                      : "bg-green-600")
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-stone-500">{strength.label}</p>
                      <FormMessage />
                    </FormItem>
                  </motion.div>
                )}
              />

              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 }}
                  >
                    <FormItem>
                      <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type={showPw2 ? "text" : "password"}
                            autoComplete="new-password"
                            className="input pe-11"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            onClick={() => setShowPw2((s) => !s)}
                            aria-label={showPw2 ? t("auth.hidePassword") : t("auth.showPassword")}
                          >
                            {showPw2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </motion.div>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 }}
                  >
                    <FormItem>
                      <FormLabel>{t("auth.howUsePlatform", { name: PLATFORM_NAME })}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="input h-11 rounded-xl border-stone-200">
                            <SelectValue placeholder={t("auth.chooseRole")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="RENTER">{t("auth.roleRenter")}</SelectItem>
                          <SelectItem value="OWNER">{t("auth.roleOwner")}</SelectItem>
                          <SelectItem value="BOTH">{t("auth.roleBoth")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </motion.div>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="space-y-0 rounded-lg border border-stone-200 bg-canvas-card p-3">
                    <div className="flex flex-row items-start gap-3">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          disabled={!termsReviewed}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-stone-300 text-brand-500 disabled:opacity-40"
                          aria-describedby="terms-hint"
                        />
                      </FormControl>
                      <div className="min-w-0 flex-1 space-y-2 leading-snug">
                        <FormLabel className="font-normal text-stone-700">
                          {t("auth.termsAgreePrefix")}{" "}
                          <Link
                            to="/terms"
                            className="font-semibold text-brand-600 hover:text-brand-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("auth.termsOfService")}
                          </Link>{" "}
                          {t("auth.and")}{" "}
                          <Link
                            to="/privacy"
                            className="font-semibold text-brand-600 hover:text-brand-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("auth.privacyPolicy")}
                          </Link>
                        </FormLabel>
                        {!termsReviewed ? (
                          <p id="terms-hint" className="text-xs text-stone-500">
                            {t("auth.termsReadHint")}
                          </p>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setTermsModalOpen(true)}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                        >
                          {termsReviewed ? t("auth.reviewTermsAgain") : t("auth.readTermsCta")}
                        </button>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <TermsAcceptanceModal
                open={termsModalOpen}
                onOpenChange={setTermsModalOpen}
                onAccepted={() => {
                  setTermsReviewed(true);
                  form.setValue("acceptTerms", true, { shouldValidate: true });
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    t("auth.createAccountButton")
                  )}
                </button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
