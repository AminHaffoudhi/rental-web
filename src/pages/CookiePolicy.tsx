import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { CookiePolicyContent } from "@/content/legal/cookiesContent";
import { LEGAL_LAST_UPDATED } from "@/content/legal/termsContent";
import { PLATFORM_NAME } from "@/config/brand";

export function CookiePolicy() {
  return (
    <LegalDocumentLayout
      title="Cookie Policy"
      description={`How ${PLATFORM_NAME} uses cookies and similar technologies on our website.`}
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <CookiePolicyContent />
    </LegalDocumentLayout>
  );
}
