import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
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
import { cn } from "@/utils/cn";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().optional(),
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string().min(8),
    role: z.enum(["RENTER", "OWNER", "BOTH"]),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

function passwordStrength(pw: string): { level: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const level = Math.min(4, Math.floor(score * 0.8));
  const labels = ["Weak", "Fair", "Good", "Strong"];
  return { level: Math.max(1, level), label: labels[Math.min(3, Math.max(0, level - 1))] };
}

export function Register() {
  const { register: registerUser } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
  const strength = useMemo(() => passwordStrength(pw || ""), [pw]);

  async function onSubmit(values: FormValues) {
    setApiError(null);
    setLoading(true);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
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
          <p className="font-display text-3xl font-semibold">RentMarket</p>
          <p className="mt-6 max-w-sm text-lg text-white/90">
            Rent anything from trusted local owners
          </p>
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
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand-600 hover:underline">
                Login →
              </Link>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {apiError ? (
                <motion.div
                  initial={{ x: [0, -8, 8, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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
                      <FormLabel>Full name</FormLabel>
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
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <input
                          type="tel"
                          autoComplete="tel"
                          placeholder="+216 XX XXX XXX"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type={showPw ? "text" : "password"}
                            autoComplete="new-password"
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
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type={showPw2 ? "text" : "password"}
                            autoComplete="new-password"
                            className="input pr-11"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            onClick={() => setShowPw2((s) => !s)}
                            aria-label={showPw2 ? "Hide password" : "Show password"}
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
                      <FormLabel>How will you use RentMarket?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="input h-11 rounded-xl border-stone-200">
                            <SelectValue placeholder="Choose…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="RENTER">I want to rent equipment</SelectItem>
                          <SelectItem value="OWNER">I want to list my equipment</SelectItem>
                          <SelectItem value="BOTH">Both — rent and list</SelectItem>
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
                  <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-stone-200 bg-white p-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-stone-300 text-brand-500"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-stone-700">
                        I agree to the Terms of Service and Privacy Policy
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
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
                    "Create Account"
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
