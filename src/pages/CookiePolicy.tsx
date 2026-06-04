import { useTranslation } from "react-i18next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { CookiePolicyContent } from "@/content/legal/cookiesContent";
import { PLATFORM_NAME } from "@/config/brand";

export function CookiePolicy() {
  const { t } = useTranslation();

  return (
    <LegalDocumentLayout
      title={t("legal.cookiesTitle")}
      description={t("legal.cookiesDesc", { name: PLATFORM_NAME })}
    >
      <CookiePolicyContent />
    </LegalDocumentLayout>
  );
}
