import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, Eye, EyeOff } from "lucide-react";
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
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

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
          <p className="font-display text-3xl font-semibold">RentMarket</p>
          <p className="mt-6 max-w-sm text-lg text-white/90">Rent anything from trusted local owners</p>
          <ul className="mt-10 space-y-3 text-white/80">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
              Thousands of listings
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
              Secure deposits
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" strokeWidth={2.5} aria-hidden />
              Delivery included
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-stone-50 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-stone-900">Welcome back</h2>
            <p className="mt-2 text-sm text-stone-500">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-brand-600 hover:underline">
                Register →
              </Link>
            </p>
            {registeredEmail ? (
              <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
                <p>
                  We sent a 6-digit code to <strong>{registeredEmail}</strong>. Enter it to verify your
                  account.
                </p>
                <Link
                  to="/verify-email"
                  state={{ email: registeredEmail }}
                  className="mt-3 inline-flex font-semibold text-brand-700 underline hover:text-brand-800"
                >
                  Go to verification →
                </Link>
              </div>
            ) : null}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {apiError ? (
                <motion.div
                  initial={{ x: [0, -8, 8, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  <p>{apiError}</p>
                </motion.div>
              ) : null}

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
                      <FormLabel>Email address</FormLabel>
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
                name="password"
                render={({ field }) => (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type={showPw ? "text" : "password"}
                            autoComplete="current-password"
                            className="input pr-11"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            onClick={() => setShowPw((s) => !s)}
                            aria-label={showPw ? "Hide password" : "Show password"}
                          >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </motion.div>
                )}
              />

              <div className="flex justify-end">
                <span className="cursor-not-allowed text-xs text-stone-400" title="Coming soon">
                  Forgot password?
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg relative w-full"
                >
                  {loading ? (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Login"
                  )}
                </button>
              </motion.div>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-stone-50 px-3 text-stone-400">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            disabled
            title="Coming soon"
            className="btn btn-secondary flex w-full items-center justify-center gap-2 opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-xs text-stone-400">
            By continuing you agree to our Terms and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
