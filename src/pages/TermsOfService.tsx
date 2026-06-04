import { useTranslation } from "react-i18next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { TermsOfServiceContent } from "@/content/legal/termsContent";
import { PLATFORM_NAME } from "@/config/brand";

export function TermsOfService() {
  const { t } = useTranslation();

  return (
    <LegalDocumentLayout
      title={t("legal.termsTitle")}
      description={t("legal.termsDesc", { name: PLATFORM_NAME })}
    >
      <TermsOfServiceContent />
    </LegalDocumentLayout>
  );
}
