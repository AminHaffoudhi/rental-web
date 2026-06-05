import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { AssistantMessage } from "@/components/assistant/AssistantMessage";
import type { AppLanguage } from "@/i18n";
import type { ChatMessage } from "@/services/assistant.service";
import { fetchAssistantStatus } from "@/services/assistant.service";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/utils/cn";
import { getApiErrorDetail } from "@/services/api";

type AssistantChatProps = {
  variant: "renter" | "owner";
  title: string;
  subtitle: string;
  welcomeMessage: string;
  placeholder: string;
  suggestedPrompts?: string[];
  onSend: (messages: ChatMessage[], language: AppLanguage) => Promise<string>;
  onLoadSuggestions?: (language: AppLanguage) => Promise<string[]>;
  className?: string;
};

export function AssistantChat({
  variant,
  title,
  subtitle,
  welcomeMessage,
  placeholder,
  suggestedPrompts = [],
  onSend,
  onLoadSuggestions,
  className,
}: AssistantChatProps) {
  const { t, i18n } = useTranslation();
  const language = useLocaleStore((s) => s.language);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [prompts, setPrompts] = useState(suggestedPrompts);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isOwner = variant === "owner";

  useEffect(() => {
    void fetchAssistantStatus()
      .then((s) => setEnabled(s.enabled))
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    if (!onLoadSuggestions) {
      setPrompts(suggestedPrompts);
      return;
    }

    let cancelled = false;
    setLoadingPrompts(true);
    void onLoadSuggestions(language)
      .then((dynamic) => {
        if (!cancelled) {
          setPrompts(dynamic.length > 0 ? dynamic : suggestedPrompts);
        }
      })
      .catch(() => {
        if (!cancelled) setPrompts(suggestedPrompts);
      })
      .finally(() => {
        if (!cancelled) setLoadingPrompts(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language, onLoadSuggestions, suggestedPrompts, i18n.language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setLoading(true);

      try {
        const reply = await onSend(next, language);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (e) {
        toast.error(getApiErrorDetail(e).message);
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, onSend, language]
  );

  const displayMessages =
    messages.length === 0
      ? [{ role: "assistant" as const, content: welcomeMessage }]
      : messages;

  function formatSuggestionLabel(text: string): string {
    return text.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-canvas-card shadow-elevated dark:border-stone-700 dark:bg-stone-900",
        className
      )}
    >
      <div className="flex shrink-0 items-start gap-3 border-b border-stone-200 bg-stone-50/80 px-5 py-4 dark:border-stone-700 dark:bg-stone-800/50 sm:px-6">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm",
            isOwner ? "bg-violet-500 text-white" : "bg-brand-500 text-white"
          )}
        >
          {isOwner ? <Bot className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
            {title}
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{subtitle}</p>
        </div>
        {enabled === false ? (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
            {t("assistant.offline")}
          </span>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {displayMessages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={`${m.role}-${i}`}
                  className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}
                >
                  {!isUser ? (
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        isOwner
                          ? "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300"
                          : "bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300"
                      )}
                      aria-hidden
                    >
                      {isOwner ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      "min-w-0 max-w-[min(100%,36rem)]",
                      isUser
                        ? "rounded-2xl rounded-ee-md bg-brand-500 px-4 py-3 text-white shadow-sm"
                        : "rounded-2xl rounded-es-md border border-stone-200 bg-white px-4 py-4 shadow-sm dark:border-stone-600 dark:bg-stone-800/80 sm:px-5 sm:py-4"
                    )}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap text-start text-sm leading-relaxed">
                        {m.content}
                      </p>
                    ) : (
                      <AssistantMessage content={m.content} />
                    )}
                  </div>

                  {isUser ? (
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300"
                      aria-hidden
                    >
                      <User className="h-4 w-4" />
                    </div>
                  ) : null}
                </div>
              );
            })}

            {loading ? (
              <div className="flex justify-start gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isOwner
                      ? "bg-violet-100 text-violet-600"
                      : "bg-stone-200 text-stone-600"
                  )}
                >
                  <Bot className="h-4 w-4 animate-pulse" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-500 dark:border-stone-600 dark:bg-stone-800">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                  {t("assistant.thinking")}
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </div>

        {messages.length === 0 && (prompts.length > 0 || loadingPrompts) ? (
          <div className="shrink-0 border-t border-stone-200 bg-stone-50/50 px-4 py-4 dark:border-stone-700 dark:bg-stone-800/30 sm:px-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
              {t("assistant.suggestionsLabel")}
            </p>
            <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-2">
              {loadingPrompts ? (
                <span className="text-xs text-stone-400">{t("assistant.loadingSuggestions")}</span>
              ) : null}
              {prompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={loading || enabled === false}
                  onClick={() => void sendMessage(p)}
                  className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-start text-sm font-medium text-stone-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 disabled:opacity-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
                >
                  {formatSuggestionLabel(p)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <form
          className="shrink-0 border-t border-stone-200 bg-canvas-card p-4 dark:border-stone-700 sm:px-6"
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(input);
          }}
        >
          <div className="mx-auto flex w-full max-w-3xl gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={loading || enabled === false}
              className="input min-w-0 flex-1 rounded-xl border-stone-200 bg-white dark:border-stone-600 dark:bg-stone-800"
              aria-label={placeholder}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || enabled === false}
              className={cn(
                "btn shrink-0 px-5",
                isOwner ? "bg-violet-600 hover:bg-violet-700" : "btn-primary"
              )}
            >
              <Send className="h-4 w-4 rtl:rotate-180" />
              <span className="sr-only">{t("assistant.send")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
