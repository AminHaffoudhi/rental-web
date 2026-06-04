import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { chatRenter } from "@/services/assistant.service";

export function DashboardAssistant() {
  const { t, i18n } = useTranslation();

  const suggestedPrompts = useMemo(
    () => [
      t("assistant.renterPrompt1"),
      t("assistant.renterPrompt2"),
      t("assistant.renterPrompt3"),
      t("assistant.renterPrompt4"),
    ],
    [t, i18n.language]
  );

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col">
      <AssistantChat
        className="h-full min-h-0 flex-1"
        variant="renter"
        title={t("assistant.renterTitle")}
        subtitle={t("assistant.renterSubtitle")}
        welcomeMessage={t("assistant.renterWelcome")}
        placeholder={t("assistant.renterPlaceholder")}
        suggestedPrompts={suggestedPrompts}
        onSend={chatRenter}
      />
    </div>
  );
}
