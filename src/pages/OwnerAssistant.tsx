import { useTranslation } from "react-i18next";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { chatOwner, fetchOwnerSuggestions } from "@/services/assistant.service";

export function OwnerAssistant() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <AssistantChat
        variant="owner"
        title={t("assistant.ownerTitle")}
        subtitle={t("assistant.ownerSubtitle")}
        welcomeMessage={t("assistant.ownerWelcome")}
        placeholder={t("assistant.ownerPlaceholder")}
        suggestedPrompts={[
          t("assistant.ownerPrompt1"),
          t("assistant.ownerPrompt2"),
          t("assistant.ownerPrompt3"),
          t("assistant.ownerPrompt4"),
        ]}
        onSend={chatOwner}
        onLoadSuggestions={fetchOwnerSuggestions}
      />
    </div>
  );
}
