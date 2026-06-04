import type { AppLanguage } from "@/i18n";
import { cookiesDocuments } from "@/content/legal/documents/cookies";
import { privacyDocuments } from "@/content/legal/documents/privacy";
import { termsDocuments } from "@/content/legal/documents/terms";
import type { LegalDocId, LegalDocument } from "@/content/legal/types";

const registry: Record<LegalDocId, Record<AppLanguage, LegalDocument>> = {
  terms: termsDocuments,
  privacy: privacyDocuments,
  cookies: cookiesDocuments,
};

export function getLegalDocument(id: LegalDocId, language: AppLanguage): LegalDocument {
  return registry[id][language] ?? registry[id].en;
}

export const LEGAL_LAST_UPDATED_ISO = "2026-06-03";
