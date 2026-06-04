import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { PrivacyPolicyContent } from "@/content/legal/privacyContent";
import { LEGAL_LAST_UPDATED } from "@/content/legal/termsContent";
import { PLATFORM_NAME } from "@/config/brand";

export function PrivacyPolicy() {
  return (
    <LegalDocumentLayout
      title="Privacy Policy"
      description={`How ${PLATFORM_NAME} collects, uses, and protects your personal data.`}
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <PrivacyPolicyContent />
    </LegalDocumentLayout>
  );
}
