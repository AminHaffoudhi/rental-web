import type { LegalDocId } from "@/content/legal/types";
import { getLegalDocument } from "@/content/legal/registry";
import { useLocaleStore } from "@/store/localeStore";

export function useLegalDocument(id: LegalDocId) {
  const language = useLocaleStore((s) => s.language);
  return getLegalDocument(id, language);
}
