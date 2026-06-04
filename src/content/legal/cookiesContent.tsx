import { Link } from "react-router-dom";
import { PLATFORM_NAME } from "@/config/brand";

export function CookiePolicyContent() {
  return (
    <>
      <p>
        This Cookie Policy explains how {PLATFORM_NAME} uses cookies and similar technologies on our
        website.         It should be read together with our <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a site. They help the site
        remember your preferences and keep you signed in securely.
      </p>

      <h2>Cookies we use</h2>
      <ul>
        <li>
          <strong>Essential:</strong> authentication tokens and session security so you can log in
          and use bookings safely.
        </li>
        <li>
          <strong>Preferences:</strong> theme choice (light/dark mode) stored locally as{" "}
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs dark:bg-stone-800">ekri-theme</code>.
        </li>
        <li>
          <strong>Analytics (if enabled):</strong> aggregated usage to improve performance and
          features — we minimize identifiable tracking.
        </li>
      </ul>

      <h2>Third parties</h2>
      <p>
        Payment pages may set cookies from our payment provider when you complete checkout. Those
        providers have their own privacy policies.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. Blocking essential cookies may
        prevent you from signing in or completing bookings.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <Link to="/contact">contact support</Link>.
      </p>
    </>
  );
}
