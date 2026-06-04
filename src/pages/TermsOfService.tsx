import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { TermsOfServiceContent, LEGAL_LAST_UPDATED } from "@/content/legal/termsContent";
import { PLATFORM_NAME } from "@/config/brand";

export function TermsOfService() {
  return (
    <LegalDocumentLayout
      title="Terms of Service"
      description={`Rules for using ${PLATFORM_NAME} as a renter, owner, or both.`}
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <TermsOfServiceContent />
    </LegalDocumentLayout>
  );
}
