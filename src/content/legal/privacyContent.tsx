import { Link } from "react-router-dom";
import { PLATFORM_NAME } from "@/config/brand";

export function PrivacyPolicyContent() {
  return (
    <>
      <p>
        {PLATFORM_NAME} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This Privacy Policy explains
        what personal data we collect, how we use it, and your choices when you use our website and
        services in Tunisia and elsewhere.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> name, email, phone (optional), password (stored securely),
          profile photo, bio, location, role (renter/owner), and verification documents for KYC.
        </li>
        <li>
          <strong>Booking data:</strong> rental dates, equipment details, messages, payment status,
          and delivery information.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, browser type, device information, and cookies
          needed for security and preferences (including theme).
        </li>
        <li>
          <strong>Communications:</strong> support requests, reviews, and notifications you receive
          or send through the platform.
        </li>
      </ul>

      <h2>2. How we use your data</h2>
      <p>We use personal data to:</p>
      <ul>
        <li>Create and manage your account.</li>
        <li>Process bookings, payments, and payouts.</li>
        <li>Verify identity for owners and prevent fraud.</li>
        <li>Send transactional emails (verification, booking updates) and optional push notifications.</li>
        <li>Improve the Service, enforce our Terms, and comply with legal obligations.</li>
      </ul>

      <h2>3. Legal basis</h2>
      <p>
        We process data based on contract performance (providing the Service), legitimate interests
        (security, analytics, product improvement), consent where required (e.g. marketing), and
        legal obligations under applicable Tunisian law including personal data protection rules.
      </p>

      <h2>4. Sharing with others</h2>
      <p>We may share data with:</p>
      <ul>
        <li>Other users, as needed to complete rentals (e.g. name and contact between renter and owner).</li>
        <li>Payment processors (e.g. Stripe) to handle transactions.</li>
        <li>Cloud hosting and email providers that help us operate the Service.</li>
        <li>Authorities when required by law or to protect rights and safety.</li>
      </ul>
      <p>We do not sell your personal data to third-party advertisers.</p>

      <h2>5. Retention</h2>
      <p>
        We keep account and booking records while your account is active and for a reasonable period
        afterward for legal, tax, and dispute resolution purposes. You may request deletion subject
        to exceptions (e.g. ongoing bookings or legal holds).
      </p>

      <h2>6. Security</h2>
      <p>
        We use industry-standard measures including encryption in transit, access controls, and secure
        password handling. No method of transmission over the internet is 100% secure; use a strong,
        unique password and protect your login credentials.
      </p>

      <h2>7. Your rights</h2>
      <p>Depending on applicable law, you may have the right to:</p>
      <ul>
        <li>Access, correct, or delete your personal data.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent where processing is consent-based.</li>
        <li>Lodge a complaint with a supervisory authority.</li>
      </ul>
      <p>
        To exercise these rights, contact us via the{" "}
        <Link to="/contact">support form</Link> or your account profile settings where available.
      </p>

      <h2>8. International transfers</h2>
      <p>
        Some service providers may process data outside Tunisia. We ensure appropriate safeguards
        where required by law.
      </p>

      <h2>9. Children</h2>
      <p>The Service is not directed at children under 18. We do not knowingly collect their data.</p>

      <h2>10. Changes</h2>
      <p>
        We may update this policy. The &quot;Last updated&quot; date will change when we do. Material changes
        may be communicated by email or in-app notice.
      </p>
    </>
  );
}
