import { LegalDocumentBody } from "@/content/legal/LegalDocumentBody";
import { useLegalDocument } from "@/content/legal/useLegalDocument";

export function CookiePolicyContent() {
  const doc = useLegalDocument("cookies");
  return <LegalDocumentBody blocks={doc.blocks} />;
}
