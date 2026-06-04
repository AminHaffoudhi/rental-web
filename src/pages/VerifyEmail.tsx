import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import * as authService from "@/services/auth.service";
import { getApiErrorDetail } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const stateEmail = (location.state as { email?: string } | null)?.email?.trim() ?? "";
  const email = stateEmail || user?.email || "";

  const hasSession = Boolean(token);
  const canAccessVerifyFlow = hasSession || Boolean(stateEmail);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (user?.emailVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [user?.emailVerified, navigate]);

  const handleSubmit = useCallback(
    async (code: string) => {
      if (submitting || code.length !== 6) return;
      setSubmitting(true);
      setError(null);
      try {
        const r = await authService.verifyEmailWithCode(code);
        setAuth(r.user, r.token);
        toast.success(r.message || "Email verified.");
        navigate("/dashboard", { replace: true });
      } catch (e) {
        setError(getApiErrorDetail(e).message);
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } finally {
        setSubmitting(false);
      }
    },
    [navigate, setAuth, submitting]
  );

  function handleDigitInput(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    const joined = newDigits.join("");
    if (newDigits.every((d) => d !== "") && joined.length === 6) {
      void handleSubmit(joined);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const text = e.clipboardData?.getData("text").replace(/\D/g, "").slice(0, 6) ?? "";
    if (text.length === 6) {
      e.preventDefault();
      setDigits(text.split(""));
      void handleSubmit(text);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || submitting) return;
    if (!email) {
      toast.error("Missing email address.");
      return;
    }
    setError(null);
    try {
      const r = hasSession
        ? await authService.resendVerificationCode()
        : await authService.resendVerificationCode({ email });
      toast.success(r.message);
      setCooldown(60);
    } catch (e) {
      const { message, code } = getApiErrorDetail(e);
      if (code === "RESEND_COOLDOWN") {
        const match = /(\d+)/.exec(message);
        if (match) setCooldown(Number.parseInt(match[1], 10));
      }
      setError(message);
    }
  }

  if (!canAccessVerifyFlow) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-canvas px-4">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-canvas-card p-8 shadow-sm">
          <div className="mb-6 flex justify-center">
            <PlatformLogo size="md" linkTo="/" />
          </div>
          <h1 className="font-display text-xl font-semibold text-stone-900">Verify your email</h1>
          <p className="mt-3 text-sm text-stone-600">
            Register to receive a 6-digit code, or use Login if you need to reach the verification page with your
            email.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn btn-primary btn-sm text-center">
              Register
            </Link>
            <Link to="/login" className="btn btn-secondary btn-sm text-center">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.emailVerified) {
    return null;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-canvas-card p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <PlatformLogo size="md" linkTo="/" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-stone-900">Check your email</h1>
        <p className="mt-2 text-sm text-stone-600">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-stone-800">{email || "your inbox"}</span>
        </p>

        <div className="mt-8 flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              aria-label={`Digit ${i + 1}`}
              disabled={submitting}
              onChange={(e) => handleDigitInput(i, e.target.value.slice(-1))}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="input h-14 w-12 rounded-xl border-2 text-center text-2xl font-bold outline-none"
            />
          ))}
        </div>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            disabled={digits.join("").length !== 6 || submitting}
            className="btn btn-primary w-full disabled:opacity-50"
            onClick={() => void handleSubmit(digits.join(""))}
          >
            {submitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Verifying…
              </span>
            ) : (
              "Verify"
            )}
          </button>
          <button
            type="button"
            disabled={cooldown > 0 || submitting}
            className="btn btn-ghost w-full text-sm"
            onClick={() => void handleResend()}
          >
            {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-stone-500">
          Wrong account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
