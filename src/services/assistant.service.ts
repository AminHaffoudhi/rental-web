import { api, unwrap } from "@/services/api";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function fetchAssistantStatus(): Promise<{ enabled: boolean; model: string }> {
  const res = await api.get("/assistant/status");
  return unwrap(res) as { enabled: boolean; model: string };
}

export async function chatRenter(messages: ChatMessage[]): Promise<string> {
  const res = await api.post("/assistant/renter", { messages });
  const data = unwrap(res) as { reply: string };
  return data.reply;
}

export async function chatOwner(messages: ChatMessage[]): Promise<string> {
  const res = await api.post("/assistant/owner", { messages });
  const data = unwrap(res) as { reply: string };
  return data.reply;
}

export async function fetchOwnerSuggestions(): Promise<string[]> {
  const res = await api.get("/assistant/owner/suggestions");
  const data = unwrap(res) as { suggestions: string[] };
  return data.suggestions;
}
