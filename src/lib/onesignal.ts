import OneSignal, {
  type NotificationClickEvent,
  type NotificationForegroundWillDisplayEvent,
} from "react-onesignal";
import {
  isOneSignalDomainMismatch,
  oneSignalSkipReason,
  shouldSkipOneSignalInit,
} from "@/lib/onesignalSite";

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initOneSignal(): Promise<void> {
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  if (!appId) {
    console.warn("[OneSignal] VITE_ONESIGNAL_APP_ID not set — skipping init");
    return;
  }
  if (initialized) {
    return;
  }
  if (initPromise) {
    return initPromise;
  }

  if (shouldSkipOneSignalInit()) {
    console.warn(oneSignalSkipReason());
    return;
  }

  initPromise = OneSignal.init({
    appId,
    allowLocalhostAsSecureOrigin: true,
    serviceWorkerParam: { scope: "/" },
    serviceWorkerPath: "OneSignalSDKWorker.js",
  })
    .then(() => {
      initialized = true;
      console.log("[OneSignal] Initialized ✅");
    })
    .catch((err) => {
      if (isOneSignalDomainMismatch(err)) {
        console.warn(oneSignalSkipReason(), err);
        return;
      }
      console.error("[OneSignal] Init failed:", err);
    });

  return initPromise;
}

export async function requestPermissionAndSubscribe(): Promise<boolean> {
  await initOneSignal();
  if (!initialized) {
    return false;
  }
  try {
    await OneSignal.Notifications.requestPermission();
    const granted = OneSignal.Notifications.permission;
    console.log("[OneSignal] Permission:", granted);
    return granted;
  } catch (err) {
    console.error("[OneSignal] Permission error:", err);
    return false;
  }
}

export async function identifyUser(userId: string, role: string): Promise<void> {
  await initOneSignal();
  if (!initialized) {
    return;
  }
  try {
    await OneSignal.login(userId);
    OneSignal.User.addTags({ role, platform: "web" });
    const id = OneSignal.User.PushSubscription.id;
    if (id) {
      const { registerOneSignalPlayerId } = await import("@/services/user.service");
      await registerOneSignalPlayerId(id);
    }
    console.log("[OneSignal] User identified:", userId, role);
  } catch (err) {
    console.warn("[OneSignal] Identify failed:", err);
  }
}

export async function logoutOneSignal(): Promise<void> {
  if (!initialized) {
    return;
  }
  try {
    await OneSignal.logout();
  } catch {
    /* ignore */
  }
}

function payloadFromNotification(
  n: { title?: string; body?: string; additionalData?: unknown; launchURL?: string }
): { title: string; body: string; data: Record<string, unknown> } {
  const additional = (n.additionalData as Record<string, unknown> | undefined) ?? {};
  const data: Record<string, unknown> = { ...additional };
  if (n.launchURL) {
    data.url = n.launchURL;
  }
  return {
    title: n.title ?? "",
    body: n.body ?? "",
    data,
  };
}

export function onNotificationReceived(
  callback: (title: string, body: string, data: Record<string, unknown>) => void
): () => void {
  let cleanedUp = false;
  const removers: Array<() => void> = [];

  void initOneSignal().then(() => {
    if (cleanedUp || !initialized) {
      return;
    }

    const onForeground = (event: NotificationForegroundWillDisplayEvent) => {
      const { title, body, data } = payloadFromNotification(event.notification);
      callback(title, body, data);
      event.preventDefault();
    };
    OneSignal.Notifications.addEventListener("foregroundWillDisplay", onForeground);
    removers.push(() =>
      OneSignal.Notifications.removeEventListener("foregroundWillDisplay", onForeground)
    );

    const onClick = (event: NotificationClickEvent) => {
      const { title, body, data } = payloadFromNotification(event.notification);
      callback(title, body, data);
    };
    OneSignal.Notifications.addEventListener("click", onClick);
    removers.push(() => OneSignal.Notifications.removeEventListener("click", onClick));
  });

  return () => {
    cleanedUp = true;
    removers.forEach((r) => r());
  };
}

export function getPermissionState(): boolean {
  if (!initialized) {
    return false;
  }
  return OneSignal.Notifications.permission;
}

export { OneSignal };
