import type { TFunction } from "i18next";
import { cleanNotificationTitle } from "@/lib/notificationDisplay";

export type LocalizableNotification = {
  title: string;
  body: string;
  type: string;
  url?: string;
  data?: Record<string, unknown>;
};

export type NotificationParams = {
  equipmentTitle?: string;
  reviewerName?: string;
  renterName?: string;
  reason?: string;
  slot?: string;
  amount?: string;
};

/** i18n key suffix under notifications.types.* */
export function notificationTypeKey(n: LocalizableNotification): string {
  if (n.type === "review_approved") {
    return n.url?.includes("/equipment/") ? "review_approved_listing" : "review_approved_profile";
  }
  return KNOWN_TYPES.has(n.type) ? n.type : "general";
}

const KNOWN_TYPES = new Set([
  "kyc_submitted",
  "kyc_approved",
  "kyc_rejected",
  "equipment_pending",
  "equipment_approved",
  "equipment_rejected",
  "review_equipment_received",
  "review_owner_received",
  "review_approved_listing",
  "review_approved_profile",
  "booking_request",
  "booking_approved",
  "booking_rejected",
  "payment_confirmed",
  "payment_received",
  "delivery_scheduled",
  "return_reminder",
  "dispute_opened",
  "payout_sent",
  "general",
]);

function quotedStrings(text: string): string[] {
  return [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

/** Pull dynamic fields from push data or legacy English API/push copy. */
export function extractNotificationParams(n: LocalizableNotification): NotificationParams {
  const data = n.data ?? {};
  const params: NotificationParams = {};
  const quotes = quotedStrings(n.body);

  if (typeof data.reason === "string" && data.reason.trim()) {
    params.reason = data.reason.trim();
  }
  if (typeof data.note === "string" && data.note.trim()) {
    params.reason = params.reason ?? data.note.trim();
  }
  if (typeof data.amount === "number") {
    params.amount = String(data.amount);
  } else if (typeof data.amount === "string") {
    params.amount = data.amount;
  }

  if (quotes[0]) params.equipmentTitle = quotes[0];

  const body = n.body;

  switch (n.type) {
    case "kyc_rejected": {
      const m = body.match(/not accepted:\s*(.+?)\.\s*Please/i);
      if (m) params.reason = params.reason ?? m[1].trim();
      break;
    }
    case "equipment_rejected": {
      const m = body.match(/not approved:\s*(.+?)(?:\.|$)/i);
      if (m) params.reason = params.reason ?? m[1].trim();
      break;
    }
    case "booking_request": {
      const push = body.match(/^(.+?)\s+wants to rent/i);
      if (push) params.renterName = push[1].trim();
      break;
    }
    case "review_equipment_received":
    case "review_approved_listing": {
      const m = body.match(/^(.+?)\s+reviewed/i) ?? body.match(/review from\s+(.+?)\s+on/i);
      if (m) params.reviewerName = m[1].trim();
      break;
    }
    case "review_owner_received":
    case "review_approved_profile": {
      const m = body.match(/^(.+?)\s+left you/i) ?? body.match(/review from\s+(.+?)\s+is now/i);
      if (m) params.reviewerName = m[1].trim();
      break;
    }
    case "delivery_scheduled": {
      const m = body.match(/delivered on\s+(.+)$/i);
      if (m) params.slot = m[1].trim();
      break;
    }
    case "payout_sent": {
      const m = body.match(/^([\d.,]+)\s+TND/i);
      if (m) params.amount = params.amount ?? m[1].trim();
      break;
    }
    default:
      break;
  }

  return params;
}

export function localizeNotification(
  n: LocalizableNotification,
  t: TFunction
): { title: string; body: string } {
  const typeKey = notificationTypeKey(n);
  const raw = extractNotificationParams(n);
  const someone = t("notifications.someone");
  const params = {
    equipmentTitle: raw.equipmentTitle ?? t("notifications.yourListing"),
    reviewerName: raw.reviewerName ?? someone,
    renterName: raw.renterName ?? someone,
    reason:
      raw.reason ??
      t("notifications.defaultReason"),
    slot: raw.slot ?? "",
    amount: raw.amount ?? "",
  };

  const title = t(`notifications.types.${typeKey}.title`, {
    defaultValue: cleanNotificationTitle(n.title),
    ...params,
  });
  const body = t(`notifications.types.${typeKey}.body`, {
    defaultValue: n.body,
    ...params,
  });

  return { title, body };
}
