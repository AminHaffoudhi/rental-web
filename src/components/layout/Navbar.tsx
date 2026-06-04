import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, LayoutDashboard, LogOut, Menu, Search, Settings, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAvatar } from "@/components/user/UserAvatar";
import NotificationBell from "@/components/shared/NotificationBell";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { isOwnerRole } from "@/lib/roles";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/utils/cn";
import { useTranslation } from "react-i18next";

export function Navbar() {
  const { t } = useTranslation();
  const isArabic = useLocaleStore((s) => s.language === "ar");
  const navigate = useNavigate();
  const location = useLocation();
  const hideNavSearch = location.pathname === "/search";
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isOwner = isOwnerRole(user?.role);
  const { logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setUserMenuOpen(false), userMenuOpen);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const runSearch = useCallback(() => {
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    setMobileOpen(false);
  }, [navigate, query]);

  const onSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    },
    [runSearch]
  );

  function handleLogout() {
    void logout();
    setUserMenuOpen(false);
    navigate("/");
  }

  return (
    <>
      <header
        className={cn(
          "app-topbar sticky top-0 z-50 w-full border-b border-stone-200 bg-canvas-card transition-[box-shadow] duration-300",
          scrolled && "shadow-sm"
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-16 max-w-7xl flex-nowrap items-center gap-3 px-4 sm:gap-4",
            !scrolled && "md:h-[76px]"
          )}
        >
          <PlatformLogo
            size={isArabic ? "md" : "lg"}
            className="shrink-0"
            imgClassName={isArabic ? "max-w-[min(140px,36vw)] sm:max-w-[165px]" : undefined}
          />

          <div
            className={cn(
              "mx-auto max-w-[420px] flex-1 md:justify-center",
              hideNavSearch ? "hidden" : "hidden md:flex"
            )}
          >
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 ltr:left-4 rtl:right-4"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKeyDown}
                placeholder={t("nav.searchEquipmentPlaceholder")}
                className={cn(
                  "input w-full rounded-full border-stone-200 bg-stone-100 py-2.5 transition-all duration-300 ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4",
                  "focus:border-brand-500 focus:bg-canvas-card focus:shadow-elevated"
                )}
                aria-label={t("common.search")}
              />
            </div>
          </div>

          <div className="ms-auto flex shrink-0 items-center gap-1 md:gap-2">
            <LanguageSwitcher compact className="hidden sm:flex" />
            <ThemeToggle className="hidden sm:flex" />
            {!isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  {t("nav.signIn")}
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  {t("nav.listEquipmentCta")}
                </Link>
              </div>
            ) : (
              <>
                <NotificationBell />

                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="rounded-full ring-offset-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >
                    <UserAvatar user={user} size="md" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute end-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-stone-200 bg-canvas-elevated shadow-elevated"
                        role="menu"
                      >
                        <div className="border-b border-stone-200 bg-stone-100/80 px-4 py-3 text-start dark:bg-stone-800/50">
                          <p className="truncate text-sm font-semibold text-stone-900">{user?.name}</p>
                          <p className="truncate text-xs text-stone-500" dir="ltr">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4 shrink-0 text-stone-400" />
                            {isOwner ? t("nav.ownerDashboard") : t("nav.myAccount")}
                          </Link>
                          <Link
                            to="/bookings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <CalendarCheck className="h-4 w-4 shrink-0 text-stone-400" />
                            {t("nav.myBookings")}
                          </Link>
                        </div>
                        <div className="mx-3 h-px bg-stone-100" />
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 shrink-0 text-stone-400" />
                            {isOwner ? t("nav.profileSettings") : t("nav.accountSettings")}
                          </Link>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm text-red-500 transition-colors hover:bg-red-50"
                            onClick={handleLogout}
                          >
                            <LogOut className="h-4 w-4 shrink-0" />
                            {t("nav.signOut")}
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </>
            )}

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={t("nav.openMenu")}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="max-h-[85vh] overflow-y-auto bg-canvas-card shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
                <span className="font-display text-lg font-semibold text-brand-600">{t("nav.menu")}</span>
                <button
                  type="button"
                  className="rounded-full p-2 text-stone-600 hover:bg-stone-100"
                  onClick={() => setMobileOpen(false)}
                  aria-label={t("nav.closeMenu")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 px-4 py-6">
                <LanguageSwitcher className="w-full justify-center" />
                <ThemeToggle variant="pill" className="w-full justify-center" />
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 ltr:left-4 rtl:right-4" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onSearchKeyDown}
                    placeholder={t("nav.searchEquipmentPlaceholder")}
                    dir={isArabic ? "rtl" : "ltr"}
                    className="input w-full rounded-full border-stone-200 bg-stone-100 py-3 text-start ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4 focus:border-brand-500 focus:bg-canvas-card focus:shadow-elevated"
                  />
                </div>

                {!isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      className="btn btn-secondary w-full justify-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("nav.signIn")}
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary w-full justify-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("nav.listEquipmentCta")}
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 border-t border-stone-200 pt-4">
                    <p className="text-start text-xs font-medium uppercase tracking-wide text-stone-400">
                      {t("nav.account")}
                    </p>
                    <Link
                      to="/dashboard"
                      className="block rounded-lg px-3 py-2 text-start text-stone-800 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
                      onClick={() => setMobileOpen(false)}
                    >
                      {isOwner ? t("nav.ownerDashboard") : t("nav.myAccount")}
                    </Link>
                    <Link
                      to="/bookings"
                      className="block rounded-lg px-3 py-2 text-start text-stone-800 hover:bg-stone-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("nav.myBookings")}
                    </Link>
                    <Link
                      to="/profile"
                      className="block rounded-lg px-3 py-2 text-start text-stone-800 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
                      onClick={() => setMobileOpen(false)}
                    >
                      {isOwner ? t("nav.profileSettings") : t("nav.accountSettings")}
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg px-3 py-2 text-start text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                    >
                      {t("nav.signOut")}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
