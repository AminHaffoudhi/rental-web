import type { SVGProps } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { PLATFORM_NAME } from "@/config/brand";

function IconTwitter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconInstagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.25-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
    </svg>
  );
}

function IconLinkedIn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const platformLinkKeys = [
  { key: "footer.browseEquipment", to: "/search" },
  { key: "footer.listYourEquipment", to: "/register" },
  { key: "nav.howItWorks", to: "/search" },
  { key: "footer.pricing", to: "/search" },
] as const;

const supportLinkKeys = [
  { key: "footer.helpCenter", to: "/search" },
  { key: "footer.contactUs", to: "/contact" },
  { key: "footer.safetyGuide", to: "/search" },
  { key: "footer.reportIssue", to: "/contact?type=report" },
] as const;

const legalLinkKeys = [
  { key: "footer.terms", to: "/terms" },
  { key: "footer.privacy", to: "/privacy" },
  { key: "footer.cookies", to: "/cookies" },
] as const;

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-inv text-[var(--surface-inverse-fg)]">
      <div className="container section-sm">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <PlatformLogo size="lg" linkTo="/" className="brightness-0 invert" />
            <p className="text-sm font-medium text-stone-300">{t("footer.tagline")}</p>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--surface-inverse-muted)]/80">
              {t("footer.description")}
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--surface-inverse-border)] p-2 text-[var(--surface-inverse-muted)] transition-colors hover:border-stone-500 hover:text-white"
                aria-label="Twitter"
              >
                <IconTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--surface-inverse-border)] p-2 text-[var(--surface-inverse-muted)] transition-colors hover:border-stone-500 hover:text-white"
                aria-label="Instagram"
              >
                <IconInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--surface-inverse-border)] p-2 text-[var(--surface-inverse-muted)] transition-colors hover:border-stone-500 hover:text-white"
                aria-label="LinkedIn"
              >
                <IconLinkedIn className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-[var(--surface-inverse-muted)]">
              {t("footer.platform")}
            </p>
            <ul className="space-y-3 text-sm">
              {platformLinkKeys.map((l) => (
                <li key={l.key}>
                  <Link className="text-[var(--surface-inverse-muted)] transition-colors hover:text-white" to={l.to}>
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-[var(--surface-inverse-muted)]">
              {t("footer.support")}
            </p>
            <ul className="space-y-3 text-sm">
              {supportLinkKeys.map((l) => (
                <li key={l.key}>
                  <Link className="text-[var(--surface-inverse-muted)] transition-colors hover:text-white" to={l.to}>
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-[var(--surface-inverse-muted)]">
              {t("footer.legal")}
            </p>
            <ul className="space-y-3 text-sm">
              {legalLinkKeys.map((l) => (
                <li key={l.key}>
                  <Link
                    className="text-[var(--surface-inverse-muted)] transition-colors hover:text-white"
                    to={l.to}
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="pt-4 text-xs text-[var(--surface-inverse-muted)]/70">
              {t("footer.rights", { year, name: PLATFORM_NAME })}
            </p>
          </div>
        </div>

        <div className="divider my-10 bg-[var(--surface-inverse-border)]" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-center text-sm text-[var(--surface-inverse-muted)] lg:text-start">
            {t("footer.madeWith")}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-end">
            <LanguageSwitcher className="[&_button]:border-white/20 [&_button]:bg-white/10 [&_button]:text-white" />
          <div className="flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--surface-inverse-fg)]">
              {t("footer.securePayments")}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--surface-inverse-fg)]">
              {t("footer.verifiedUsers")}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--surface-inverse-fg)]">
              {t("footer.support247")}
            </span>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
