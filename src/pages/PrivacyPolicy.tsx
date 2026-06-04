import { useTranslation } from "react-i18next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { PrivacyPolicyContent } from "@/content/legal/privacyContent";
import { LEGAL_LAST_UPDATED } from "@/content/legal/termsContent";
import { PLATFORM_NAME } from "@/config/brand";

export function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <LegalDocumentLayout
      title={t("legal.privacyTitle")}
      description={t("legal.privacyDesc", { name: PLATFORM_NAME })}
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <PrivacyPolicyContent />
    </LegalDocumentLayout>
  );
}
