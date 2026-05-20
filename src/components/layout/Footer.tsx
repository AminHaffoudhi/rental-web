import type { SVGProps } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

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

const platformLinks = [
  { label: "Browse Equipment", to: "/search" },
  { label: "List Your Equipment", to: "/register" },
  { label: "How It Works", to: "/search" },
  { label: "Pricing", to: "/search" },
];

const supportLinks = [
  { label: "Help Center", to: "/search" },
  { label: "Contact Us", to: "/search" },
  { label: "Safety Guide", to: "/search" },
  { label: "Report an Issue", to: "/search" },
];

const legalLinks = [
  { label: "Terms of Service", to: "#" },
  { label: "Privacy Policy", to: "#" },
  { label: "Cookie Policy", to: "#" },
];

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-100">
      <div className="container section-sm">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="font-display text-xl font-semibold text-white">RentMarket</p>
            <p className="text-sm font-medium text-stone-300">
              The trusted marketplace for equipment rental
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-stone-400">
              Connect with local equipment owners. Rent what you need, when you need it.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-700 p-2 text-stone-400 transition-colors hover:border-stone-500 hover:text-white"
                aria-label="Twitter"
              >
                <IconTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-700 p-2 text-stone-400 transition-colors hover:border-stone-500 hover:text-white"
                aria-label="Instagram"
              >
                <IconInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-700 p-2 text-stone-400 transition-colors hover:border-stone-500 hover:text-white"
                aria-label="LinkedIn"
              >
                <IconLinkedIn className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-stone-400">
              Platform
            </p>
            <ul className="space-y-3 text-sm">
              {platformLinks.map((l) => (
                <li key={l.label}>
                  <Link className="text-stone-300 transition-colors hover:text-white" to={l.to}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-stone-400">
              Support
            </p>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link className="text-stone-300 transition-colors hover:text-white" to={l.to}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-stone-400">
              Legal
            </p>
            <ul className="space-y-3 text-sm">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <a className="text-stone-300 transition-colors hover:text-white" href={l.to}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="pt-4 text-xs text-stone-500">© 2026 RentMarket. All rights reserved.</p>
          </div>
        </div>

        <div className="divider my-10 bg-stone-700" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex items-center justify-center gap-1.5 text-center text-sm text-stone-400 lg:justify-start">
            Made with
            <Heart className="inline h-4 w-4 fill-red-400/80 text-red-400/80" aria-hidden />
            for equipment owners and renters
          </p>
          <div className="flex flex-wrap justify-center gap-2 lg:justify-end">
            <span className="rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-stone-300">
              Secure Payments
            </span>
            <span className="rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-stone-300">
              Verified Users
            </span>
            <span className="rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-stone-300">
              24/7 Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
