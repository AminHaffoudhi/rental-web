import { LegalDocumentBody } from "@/content/legal/LegalDocumentBody";
import { useLegalDocument } from "@/content/legal/useLegalDocument";

export function PrivacyPolicyContent() {
  const doc = useLegalDocument("privacy");
  return <LegalDocumentBody blocks={doc.blocks} />;
}
