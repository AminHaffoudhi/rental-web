import { Link } from "react-router-dom";
import { PLATFORM_NAME } from "@/config/brand";

export const LEGAL_LAST_UPDATED = "3 June 2026";

export function TermsOfServiceContent() {
  return (
    <>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the {PLATFORM_NAME}{" "}
        platform, website, and related services (collectively, the &quot;Service&quot;). By creating an
        account or using the Service, you agree to these Terms. If you do not agree, do not use the
        Service.
      </p>

      <h2>1. About {PLATFORM_NAME}</h2>
      <p>
        {PLATFORM_NAME} is an online marketplace that connects equipment owners (&quot;Owners&quot;) with
        individuals or businesses seeking to rent equipment (&quot;Renters&quot;) in Tunisia. We facilitate
        discovery, booking requests, payments, and communication but are not a party to the rental
        contract between Owner and Renter unless explicitly stated.
      </p>

      <h2>2. Eligibility and accounts</h2>
      <ul>
        <li>You must be at least 18 years old and able to enter a binding contract.</li>
        <li>You must provide accurate registration information and keep your account secure.</li>
        <li>
          Owners who list equipment may be required to complete identity verification (KYC) before
          listings go live.
        </li>
        <li>We may suspend or terminate accounts that violate these Terms or applicable law.</li>
      </ul>

      <h2>3. Listings and bookings</h2>
      <p>
        Owners are responsible for the accuracy of listings, including photos, pricing in Tunisian
        dinar (TND), availability, location, deposit requirements, and equipment condition. Renters
        submit booking requests for specific dates; Owners may approve or decline. A booking is
        confirmed only when both parties complete the steps shown in the booking workflow (including
        payment where required).
      </p>
      <ul>
        <li>Renters must use equipment only for lawful purposes and return it in agreed condition.</li>
        <li>Security deposits may be held and released after inspection, subject to dispute rules.</li>
        <li>Platform fees apply as displayed at checkout and in the price breakdown.</li>
      </ul>

      <h2>4. Payments</h2>
      <p>
        Payments are processed through our payment partners. Prices are shown in TND unless otherwise
        stated. You authorize us and our payment providers to charge amounts for rentals, fees, and
        deposits according to the booking summary. Failed or disputed payments may result in
        cancellation or account restrictions.
      </p>

      <h2>5. Cancellations, disputes, and refunds</h2>
      <p>
        Cancellation and refund eligibility depend on booking status and the reason for cancellation.
        Either party may raise a dispute through the Service for issues such as non-delivery, damage,
        or misrepresentation. We may review disputes and take action on accounts or payouts, but we
        do not guarantee a particular outcome. Nothing in these Terms limits your statutory rights
        under Tunisian consumer law where applicable.
      </p>

      <h2>6. Reviews and content</h2>
      <p>
        You may submit reviews and other content. You grant {PLATFORM_NAME} a non-exclusive license to
        use, display, and moderate that content on the Service. Do not post false, offensive, or
        infringing material. We may remove content at our discretion.
      </p>

      <h2>7. Prohibited conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Circumvent the platform to avoid fees or safety measures.</li>
        <li>List stolen, unsafe, or illegal equipment.</li>
        <li>Harass other users or misuse personal data obtained through the Service.</li>
        <li>Attempt to disrupt, scrape, or reverse-engineer the Service.</li>
      </ul>

      <h2>8. Liability</h2>
      <p>
        The Service is provided &quot;as is&quot; to the extent permitted by law. {PLATFORM_NAME} is not
        liable for indirect or consequential damages arising from rentals between users. Our total
        liability to you for claims related to the Service is limited to the fees you paid to us in
        the twelve months before the claim, except where law prohibits such limitation.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update these Terms. We will post the revised version on the Service and update the
        &quot;Last updated&quot; date. Continued use after changes constitutes acceptance of the revised
        Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms: use our{" "}
        <Link to="/contact">contact form</Link> or the support channels listed on the website.
      </p>
    </>
  );
}
