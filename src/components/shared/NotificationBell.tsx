import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLocaleFormat } from "@/hooks/useLocaleFormat";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  Bell,
  BellRing,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CheckCheck,
  ClipboardList,
  CreditCard,
  ExternalLink,
  MessageSquare,
  Package,
  PackageCheck,
  PackageX,
  RotateCcw,
  Scale,
  ShieldX,
  ThumbsUp,
  Truck,
  UserCircle,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  getPermissionState,
  initOneSignal,
  onNotificationReceived,
  requestPermissionAndSubscribe,
} from "@/lib/onesignal";
import { api, unwrap } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";
import {
  applyNotificationState,
  dismissAllNotifications,
  dismissNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notificationState";
import { cleanNotificationTitle } from "@/lib/notificationDisplay";
import { localizeNotification } from "@/lib/localizeNotification";
import {
  equipmentIdFromNotification,
  notificationTargetPath,
} from "@/lib/notificationNavigation";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  url?: string;
  timestamp: Date;
  read: boolean;
  /** OneSignal / API metadata for localized copy */
  data?: Record<string, unknown>;
}

type NotificationVisual = {
  Icon: LucideIcon;
  bg: string;
  iconClass: string;
};

const TYPE_CONFIG: Record<string, NotificationVisual> = {
  kyc_submitted: { Icon: ClipboardList, bg: "bg-amber-50 dark:bg-amber-500/15", iconClass: "text-amber-600" },
  kyc_approved: { Icon: BadgeCheck, bg: "bg-emerald-50 dark:bg-emerald-500/15", iconClass: "text-emerald-600" },
  kyc_rejected: { Icon: ShieldX, bg: "bg-red-50 dark:bg-red-500/15", iconClass: "text-red-600" },
  booking_request: { Icon: CalendarClock, bg: "bg-brand-50 dark:bg-brand-500/15", iconClass: "text-brand-600" },
  booking_approved: { Icon: CalendarCheck, bg: "bg-green-50 dark:bg-green-500/15", iconClass: "text-green-600" },
  booking_rejected: { Icon: CalendarX, bg: "bg-red-50 dark:bg-red-500/15", iconClass: "text-red-600" },
  payment_confirmed: { Icon: CreditCard, bg: "bg-teal-50 dark:bg-teal-500/15", iconClass: "text-teal-600" },
  payment_received: { Icon: Wallet, bg: "bg-emerald-50 dark:bg-emerald-500/15", iconClass: "text-emerald-600" },
  delivery_scheduled: { Icon: Truck, bg: "bg-blue-50 dark:bg-blue-500/15", iconClass: "text-blue-600" },
  return_reminder: { Icon: RotateCcw, bg: "bg-orange-50 dark:bg-orange-500/15", iconClass: "text-orange-600" },
  dispute_opened: { Icon: Scale, bg: "bg-rose-50 dark:bg-rose-500/15", iconClass: "text-rose-600" },
  payout_sent: { Icon: Banknote, bg: "bg-lime-50 dark:bg-lime-500/15", iconClass: "text-lime-700" },
  equipment_pending: { Icon: Package, bg: "bg-amber-50 dark:bg-amber-500/15", iconClass: "text-amber-600" },
  equipment_approved: { Icon: PackageCheck, bg: "bg-emerald-50 dark:bg-emerald-500/15", iconClass: "text-emerald-600" },
  equipment_rejected: { Icon: PackageX, bg: "bg-red-50 dark:bg-red-500/15", iconClass: "text-red-600" },
  review_owner_received: { Icon: UserCircle, bg: "bg-sky-50 dark:bg-sky-500/15", iconClass: "text-sky-600" },
  review_equipment_received: { Icon: MessageSquare, bg: "bg-indigo-50 dark:bg-indigo-500/15", iconClass: "text-indigo-600" },
  review_approved: { Icon: ThumbsUp, bg: "bg-violet-50 dark:bg-violet-500/15", iconClass: "text-violet-600" },
  general: { Icon: Bell, bg: "bg-stone-100 dark:bg-stone-800", iconClass: "text-stone-500" },
};

function loadNotifications(): AppNotification[] {
  try {
    const raw = sessionStorage.getItem("app_notifications");
    if (!raw) {
      return [];
    }
    const parsed = applyNotificationState(
      (JSON.parse(raw) as AppNotification[]).map((n) => ({
        ...n,
        title: cleanNotificationTitle(n.title),
        timestamp: new Date(n.timestamp),
      }))
    );
    return parsed;
  } catch {
    return [];
  }
}

function saveNotifications(notifications: AppNotification[]): void {
  try {
    sessionStorage.setItem("app_notifications", JSON.stringify(notifications));
  } catch {
    /* ignore */
  }
}

interface ApiNotificationRow {
  id: string;
  type: string;
  title: string;
  body: string;
  url: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationBell() {
  const { t } = useTranslation();
  const { formatRelativeTime } = useLocaleFormat();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications);
  const [permission, setPermission] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    void initOneSignal().then(() => setPermission(getPermissionState()));
  }, []);

  const addNotification = useCallback((n: AppNotification) => {
    setNotifications((prev) => {
      const updated = applyNotificationState([n, ...prev].slice(0, 30));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onNotificationReceived((title, body, data) => {
      const type = (data.type as string) || "general";
      const equipmentId =
        typeof data.equipmentId === "string"
          ? data.equipmentId
          : null;
      const rawUrl = typeof data.url === "string" ? data.url : undefined;
      const url = rawUrl
        ? notificationTargetPath(rawUrl, equipmentId)
        : undefined;
      addNotification({
        id: equipmentId
          ? `push-${type}-${equipmentId}-${Date.now()}`
          : `push-${type}-${Date.now()}`,
        title: cleanNotificationTitle(title),
        body,
        type,
        url,
        data,
        timestamp: new Date(),
        read: false,
      });
    });
    return unsubscribe;
  }, [addNotification]);

  const fetchFromAPI = useCallback(async () => {
    if (!useAuthStore.getState().token) {
      return;
    }
    try {
      const res = await api.get("/notifications");
      const rows = unwrap(res) as ApiNotificationRow[];
      const incoming: AppNotification[] = rows.map((n) => ({
        id: n.id,
        title: cleanNotificationTitle(n.title),
        body: n.body,
        type: n.type,
        url: n.url,
        timestamp: new Date(n.timestamp),
        read: n.read,
      }));

      setNotifications((prev) => {
        const byId = new Map(prev.map((p) => [p.id, p]));
        for (const n of incoming) {
          const existing = byId.get(n.id);
          byId.set(n.id, existing ? { ...n, read: existing.read } : n);
        }
        const merged = applyNotificationState(
          [...byId.values()]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 30)
        );
        saveNotifications(merged);
        return merged;
      });
    } catch {
      /* best-effort */
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    void fetchFromAPI();
    const interval = setInterval(() => void fetchFromAPI(), 30_000);
    return () => clearInterval(interval);
  }, [fetchFromAPI, token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    function onVisible() {
      if (document.visibilityState === "visible") {
        void fetchFromAPI();
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchFromAPI, token]);

  useClickOutside(dropdownRef, () => setOpen(false), open);

  function markRead(id: string): void {
    markNotificationRead(id);
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(updated);
      return updated;
    });
  }

  function openNotification(n: AppNotification): void {
    if (!n.url) {
      return;
    }
    const equipmentId = equipmentIdFromNotification(n);
    const path = notificationTargetPath(n.url, equipmentId);
    navigate(path);
  }

  function markAllRead(): void {
    setNotifications((prev) => {
      markAllNotificationsRead(prev.map((n) => n.id));
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }

  function dismiss(id: string): void {
    dismissNotification(id);
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }

  function clearAll(): void {
    setNotifications((prev) => {
      dismissAllNotifications(prev.map((n) => n.id));
      saveNotifications([]);
      return [];
    });
  }

  async function handleEnableNotifications(): Promise<void> {
    setRequesting(true);
    const granted = await requestPermissionAndSubscribe();
    setPermission(granted);
    setRequesting(false);
  }

  if (!import.meta.env.VITE_ONESIGNAL_APP_ID) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => {
            if (!o) {
              void fetchFromAPI();
            }
            return !o;
          });
        }}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150",
          open ? "bg-brand-50 text-brand-500" : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        )}
        aria-label={t("notifications.ariaLabel")}
      >
        <AnimatePresence mode="wait">
          {unread > 0 ? (
            <motion.div
              key="ring"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <BellRing size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="bell"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Bell size={18} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {unread > 0 ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -end-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute end-0 top-11 z-[100] w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-stone-200 bg-canvas-elevated shadow-elevated"
            role="menu"
          >
            <div className="flex items-center justify-between border-b border-stone-200 bg-stone-100/80 px-4 py-3 text-start">
              <div className="flex items-center gap-2">
                <Bell size={13} className="text-stone-400" />
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                  {t("notifications.title")}
                </span>
                {unread > 0 ? (
                  <span className="badge badge-brand text-[10px]">
                    {t("notifications.newBadge", { count: unread })}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 ? (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-brand-500 transition-all hover:bg-brand-50 hover:text-brand-600"
                  >
                    <CheckCheck size={12} />
                    {t("notifications.readAll")}
                  </button>
                ) : null}
              </div>
            </div>

            {!permission ? (
              <div className="mx-3 my-3 rounded-xl border border-brand-200/80 bg-brand-50 p-3 dark:border-brand-500/30 dark:bg-brand-500/10">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500">
                    <Bell size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-brand-900 dark:text-brand-100">
                      {t("notifications.enableTitle")}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-brand-700 dark:text-brand-300">
                      {t("notifications.enableDesc")}
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleEnableNotifications()}
                      disabled={requesting}
                      className="btn btn-primary btn-sm mt-2 w-full"
                    >
                      {requesting ? t("notifications.enabling") : t("notifications.enableBtn")}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="max-h-[360px] overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
                    <Bell size={22} className="text-stone-300" />
                  </div>
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                    {t("notifications.emptyTitle")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-400">
                    {t("notifications.emptyDesc")}
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((n) => {
                    const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.general;
                    const { Icon } = config;
                    const { title: localizedTitle, body: localizedBody } = localizeNotification(n, t);
                    return (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          markRead(n.id);
                          if (n.url) {
                            setOpen(false);
                            openNotification(n);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            markRead(n.id);
                            if (n.url) {
                              setOpen(false);
                              openNotification(n);
                            }
                          }
                        }}
                        className={cn(
                          "group relative flex cursor-pointer gap-3 border-b border-stone-200 px-4 py-3 transition-colors last:border-0 dark:border-stone-700",
                          n.read
                            ? "hover:bg-stone-100/60 dark:hover:bg-stone-800/50"
                            : "bg-brand-50/30 hover:bg-brand-50/50 dark:bg-brand-500/10 dark:hover:bg-brand-500/15"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            config.bg
                          )}
                        >
                          <Icon size={16} strokeWidth={2} className={config.iconClass} aria-hidden />
                        </div>

                        <div className="min-w-0 flex-1 pe-4 text-start">
                          <p
                            className={cn(
                              "text-[13px] leading-snug",
                              n.read ? "text-stone-600" : "font-semibold text-stone-900 dark:text-stone-100"
                            )}
                          >
                            {localizedTitle}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                            {localizedBody}
                          </p>
                          <div className="mt-1.5 flex items-center gap-3">
                            <span className="text-[10px] text-stone-400">
                              {formatRelativeTime(n.timestamp)}
                            </span>
                            {n.url ? (
                              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-brand-500">
                                {t("notifications.view")} <ExternalLink size={9} />
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {!n.read ? (
                          <div className="absolute end-8 top-4 h-2 w-2 rounded-full bg-brand-500" />
                        ) : null}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(n.id);
                          }}
                          className="absolute end-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 opacity-0 transition-opacity hover:bg-stone-200 group-hover:opacity-100"
                          aria-label={t("notifications.dismiss")}
                        >
                          <X size={10} className="text-stone-500" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {notifications.length > 0 ? (
              <div className="flex items-center justify-between border-t border-stone-200 bg-stone-100/80 px-4 py-2.5">
                <span className="text-[11px] text-stone-400">
                  {notifications.length === 1
                    ? t("notifications.count", { count: notifications.length })
                    : t("notifications.count_plural", { count: notifications.length })}
                </span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[11px] font-medium text-stone-400 transition-colors hover:text-red-500"
                >
                  {t("notifications.clearAll")}
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
