import { useTranslation } from "react-i18next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { PrivacyPolicyContent } from "@/content/legal/privacyContent";
import { PLATFORM_NAME } from "@/config/brand";

export function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <LegalDocumentLayout
      title={t("legal.privacyTitle")}
      description={t("legal.privacyDesc", { name: PLATFORM_NAME })}
    >
      <PrivacyPolicyContent />
    </LegalDocumentLayout>
  );
}
