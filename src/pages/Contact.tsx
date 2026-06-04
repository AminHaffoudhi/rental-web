import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Clock, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { PLATFORM_NAME } from "@/config/brand";
import { getApiErrorDetail } from "@/services/api";
import * as contactService from "@/services/contact.service";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Please enter at least 10 characters").max(5000),
});

type FormValues = z.infer<typeof schema>;

export function Contact() {
  const [searchParams] = useSearchParams();
  const isReport = searchParams.get("type") === "report";
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const pageTitle = isReport ? "Report an issue" : "Contact us";
  const pageDescription = useMemo(
    () =>
      isReport
        ? "Describe the problem (booking, payment, safety, or account). Our team will review it promptly."
        : "Questions about bookings, listings, payments, or your account? Send us a message and we'll respond as soon as we can.",
    [isReport]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const result = await contactService.submitContactForm({
        ...values,
        type: isReport ? "REPORT" : "CONTACT",
        subject: values.subject || (isReport ? "Issue report" : undefined),
      });
      toast.success(result.message);
      setSent(true);
      form.reset();
    } catch (e) {
      toast.error(getApiErrorDetail(e).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-stone-200 bg-canvas-card/80">
        <div className="container py-10 sm:py-12">
          <PlatformLogo size="sm" className="mb-6" />
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Support
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
            {pageTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-500 sm:text-base dark:text-stone-400">
            {pageDescription}
          </p>
        </div>
      </div>

      <div className="container py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-elevated">
              <h2 className="font-display text-lg font-semibold text-stone-900">
                How we can help
              </h2>
              <ul className="mt-4 space-y-4 text-sm text-stone-600">
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
                  <span>Booking issues, cancellations, and payment questions</span>
                </li>
                <li className="flex gap-3">
                  <MessageSquare className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
                  <span>Listing approval, KYC verification, and owner payouts</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
                  <span>Account access, privacy requests, and safety reports</span>
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-brand-200/60 bg-brand-50/80 p-4 dark:border-brand-500/25 dark:bg-brand-500/10">
              <Clock className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden />
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Typical response time is <strong className="text-stone-800 dark:text-stone-200">1–2 business days</strong>.
                For urgent booking matters, include your booking reference in the message.
              </p>
            </div>

            <p className="text-sm text-stone-500">
              Legal inquiries: see our{" "}
              <Link to="/privacy" className="font-semibold text-brand-600 hover:text-brand-700">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms" className="font-semibold text-brand-600 hover:text-brand-700">
                Terms of Service
              </Link>
              .
            </p>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-elevated sm:p-8"
          >
            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 text-green-600 dark:text-green-400">
                  <Send className="h-7 w-7" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-stone-900">
                  Message sent
                </h3>
                <p className="mt-2 text-sm text-stone-500">
                  Thank you for contacting {PLATFORM_NAME}. We&apos;ve received your request.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary mt-6"
                  onClick={() => setSent(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <input className="input" autoComplete="given-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <input className="input" autoComplete="family-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            className="input"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone <span className="font-normal text-stone-400">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <input
                            type="tel"
                            className="input"
                            autoComplete="tel"
                            placeholder="+216 …"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject{" "}
                          <span className="font-normal text-stone-400">
                            ({isReport ? "recommended" : "optional"})
                          </span>
                        </FormLabel>
                        <FormControl>
                          <input
                            className="input"
                            placeholder={
                              isReport ? "e.g. Booking #12345 — payment issue" : "What is this about?"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <textarea
                            rows={5}
                            className="input min-h-[120px] resize-y"
                            placeholder="Describe your question or issue…"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {loading ? (
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
