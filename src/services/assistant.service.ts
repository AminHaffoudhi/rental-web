import type { AppLanguage } from "@/i18n";
import { api, unwrap } from "@/services/api";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function fetchAssistantStatus(): Promise<{ enabled: boolean; model: string }> {
  const res = await api.get("/assistant/status");
  return unwrap(res) as { enabled: boolean; model: string };
}

export async function chatRenter(
  messages: ChatMessage[],
  language: AppLanguage
): Promise<string> {
  const res = await api.post("/assistant/renter", { messages, language });
  const data = unwrap(res) as { reply: string };
  return data.reply;
}

export async function chatOwner(
  messages: ChatMessage[],
  language: AppLanguage
): Promise<string> {
  const res = await api.post("/assistant/owner", { messages, language });
  const data = unwrap(res) as { reply: string };
  return data.reply;
}

export async function fetchOwnerSuggestions(language: AppLanguage): Promise<string[]> {
  const res = await api.get("/assistant/owner/suggestions", { params: { lang: language } });
  const data = unwrap(res) as { suggestions: string[] };
  return data.suggestions;
}
