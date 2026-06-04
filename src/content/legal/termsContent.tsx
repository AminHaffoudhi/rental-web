import { LegalDocumentBody } from "@/content/legal/LegalDocumentBody";
import { useLegalDocument } from "@/content/legal/useLegalDocument";

export { LEGAL_LAST_UPDATED_ISO as LEGAL_LAST_UPDATED } from "@/content/legal/registry";

export function TermsOfServiceContent() {
  const doc = useLegalDocument("terms");
  return <LegalDocumentBody blocks={doc.blocks} />;
}
