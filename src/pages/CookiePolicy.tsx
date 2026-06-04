import { useTranslation } from "react-i18next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { CookiePolicyContent } from "@/content/legal/cookiesContent";
import { LEGAL_LAST_UPDATED } from "@/content/legal/termsContent";
import { PLATFORM_NAME } from "@/config/brand";

export function CookiePolicy() {
  const { t } = useTranslation();

  return (
    <LegalDocumentLayout
      title={t("legal.cookiesTitle")}
      description={t("legal.cookiesDesc", { name: PLATFORM_NAME })}
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <CookiePolicyContent />
    </LegalDocumentLayout>
  );
}
