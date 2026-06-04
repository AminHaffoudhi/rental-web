import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  Package,
  Shield,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { PLATFORM_NAME } from "@/config/brand";

type AuthBrandPanelVariant = "login" | "register";

const loginPerkIcons = [BadgeCheck, Shield, Truck] as const;
const loginPerkKeys = [
  "auth.loginPerkVerified",
  "auth.loginPerkSecure",
  "auth.loginPerkDelivery",
] as const;

const registerPerkIcons = [Package, Shield, Truck, BadgeCheck, CreditCard] as const;
const registerPerkKeys = [
  "auth.registerPerkListings",
  "auth.registerPerkDeposits",
  "auth.registerPerkDelivery",
  "auth.registerPerkVerified",
  "auth.registerPerkPayments",
] as const;

type AuthBrandPanelProps = {
  variant: AuthBrandPanelVariant;
};

export function AuthBrandPanel({ variant }: AuthBrandPanelProps) {
  const { t } = useTranslation();
  const isLogin = variant === "login";

  const perkIcons = isLogin ? loginPerkIcons : registerPerkIcons;
  const perkKeys = isLogin ? loginPerkKeys : registerPerkKeys;
  const perks = perkIcons.map((icon, i) => ({ icon, key: perkKeys[i] }));

  const titleKey = isLogin ? "auth.loginPanelTitle" : "auth.registerPanelTitle";
  const subtitleKey = isLogin ? "auth.loginPanelSubtitle" : "auth.registerPanelSubtitle";

  return (
    <aside className="relative hidden w-full max-w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 px-10 py-12 text-white xl:px-14 xl:py-16 lg:flex">
      <div
        className="pointer-events-none absolute -start-20 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-16 bottom-0 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl"
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

      <div className="relative z-[1] w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t("common.backToHome")}
        </Link>
        <div className="mt-8 flex w-full justify-center py-2 sm:mt-10 sm:py-4">
          <PlatformLogo
            size="3xl"
            linkTo="/"
            onDarkBackground
            centered
          />
        </div>
      </div>

      <div className="relative z-[1] w-full text-start">
        {!isLogin ? (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/95 ring-1 ring-white/20">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {t("auth.registerWhyJoin")}
          </p>
        ) : null}
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight xl:text-[2.35rem]">
          {t(titleKey)}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">
          {t(subtitleKey)}
        </p>

        {!isLogin ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Users className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-sm font-medium leading-snug text-white/95">
              {t("auth.registerStatUsers")}
            </p>
          </div>
        ) : null}

        <ul className="mt-8 space-y-3.5 sm:mt-10 sm:space-y-4">
          {perks.map(({ icon: Icon, key }) => (
            <li key={key} className="flex items-center gap-3 text-white/90">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-sm font-medium sm:text-base">{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-[1] w-full text-start text-sm text-white/60">
        {t("auth.loginBuiltFor", {
          year: new Date().getFullYear(),
          name: PLATFORM_NAME,
        })}
      </p>
    </aside>
  );
}
