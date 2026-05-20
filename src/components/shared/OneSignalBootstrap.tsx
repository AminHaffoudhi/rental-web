import { useEffect } from "react";
import { identifyUser } from "@/lib/onesignal";
import { useAuthStore } from "@/store/authStore";

/** Re-identify OneSignal when session is restored from localStorage (not only on login). */
export function OneSignalBootstrap(): null {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.id) {
      void identifyUser(user.id, user.role).catch(() => {});
    }
  }, [user?.id, user?.role]);

  return null;
}
