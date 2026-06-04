import { ChevronRight, LogOut, Menu, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "@/components/shared/NotificationBell";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserAvatar } from "@/components/user/UserAvatar";
import { PlatformLogo } from "@/components/brand/PlatformLogo";
import { useDashboardNav } from "@/hooks/useDashboardNav";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

function DashboardPageTitle({
  labels,
  fallback,
}: {
  labels: Record<string, string>;
  fallback: string;
}) {
  const location = useLocation();
  const label = labels[location.pathname] ?? fallback;
  return (
    <h1 className="app-topbar-title min-w-0 truncate font-display text-lg font-semibold leading-tight text-stone-900 dark:text-stone-100">
      {label}
    </h1>
  );
}

function SidebarNav({
  onNavigate,
  isOwner,
  sections,
  addListingLabel,
}: {
  onNavigate?: () => void;
  isOwner: boolean;
  sections: ReturnType<typeof useDashboardNav>["sections"];
  addListingLabel: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex justify-center border-b border-[var(--surface-inverse-border)] px-6 py-5">
        <NavLink to="/" className="inline-flex w-full justify-center" onClick={onNavigate}>
          <PlatformLogo size="lg" linkTo={false} onDarkBackground centered />
        </NavLink>
      </div>

      {isOwner ? (
        <div className="px-4 pb-3 pt-5">
          <NavLink
            to="/equipment/new"
            onClick={onNavigate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-warm transition-all duration-200 hover:bg-brand-600 hover:shadow-md"
          >
            <Plus size={16} />
            {addListingLabel}
          </NavLink>
        </div>
      ) : null}

      <nav className="mt-2 min-h-0 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {sections.map((block) => (
          <div key={block.section}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--surface-inverse-muted)]">
              {block.section}
            </p>
            <ul className="space-y-0.5">
              {block.links.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={"end" in item ? item.end : false}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                          isActive
                            ? "border-s-2 border-brand-500 bg-brand-500/15 ps-[10px] text-brand-400"
                            : "border-s-2 border-transparent text-[var(--surface-inverse-muted)] hover:bg-canvas-card/5 hover:text-[var(--surface-inverse-fg)]"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={17}
                            className={cn(
                              isActive
                                ? "text-brand-400"
                                : "text-[var(--surface-inverse-muted)] group-hover:text-[var(--surface-inverse-fg)]"
                            )}
                          />
                          {item.label}
                          {isActive ? (
                            <ChevronRight size={14} className="ms-auto text-brand-500/60 rtl:rotate-180" />
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function DashboardLayout() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isOwner, sections, mobileLinks, breadcrumbs } = useDashboardNav();

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
    setMobileNavOpen(false);
  }

  const closeMobile = () => setMobileNavOpen(false);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-canvas">
      <header className="app-topbar z-30 flex h-16 w-full shrink-0 flex-nowrap items-center justify-between gap-3 border-b border-stone-200 bg-canvas-card px-4 sm:px-6 lg:px-8 dark:border-stone-800">
        <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 lg:hidden"
            aria-label={t("dashboard.openMenu")}
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu size={20} />
          </button>
          <DashboardPageTitle labels={breadcrumbs} fallback={t("dashboard.defaultTitle")} />
        </div>
        <div className="flex shrink-0 flex-nowrap items-center gap-2 sm:gap-3">
          <LanguageSwitcher compact className="hidden sm:flex" />
          <ThemeToggle />
          <NotificationBell />
          <NavLink
            to="/profile"
            className="shrink-0 rounded-full ring-offset-2 ring-offset-[var(--canvas-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <UserAvatar user={user} size="sm" />
          </NavLink>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {mobileNavOpen ? (
          <button
            type="button"
            className="fixed inset-0 top-16 z-40 bg-black/40 lg:hidden"
            aria-label={t("dashboard.closeMenu")}
            onClick={closeMobile}
          />
        ) : null}

        <aside
          className={cn(
            "fixed bottom-0 start-0 top-16 z-50 flex w-60 shrink-0 flex-col bg-stone-inv transition-transform duration-200 lg:static lg:top-auto lg:h-full lg:translate-x-0",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:translate-x-0"
          )}
        >
        <button
          type="button"
          className="absolute end-3 top-4 rounded-lg p-2 text-[var(--surface-inverse-muted)] hover:bg-canvas-card/5 hover:text-white lg:hidden"
          onClick={closeMobile}
          aria-label={t("dashboard.closeSidebar")}
        >
          <X size={18} />
        </button>
        <SidebarNav
          onNavigate={closeMobile}
          isOwner={isOwner}
          sections={sections}
          addListingLabel={t("dashboard.addNewListing")}
        />
        <div className="mt-auto border-t border-[var(--surface-inverse-border)] p-4">
          <div className="mb-3 flex items-center gap-3">
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0 flex-1 text-start">
              <p className="truncate text-sm font-medium text-[var(--surface-inverse-fg)]">
                {user?.name}
              </p>
              <p className="truncate text-xs text-[var(--surface-inverse-muted)]" dir="ltr">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm text-[var(--surface-inverse-muted)] transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={15} />
            {t("dashboard.logout")}
          </button>
        </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto w-full max-w-7xl p-6 pb-[max(5.5rem,env(safe-area-inset-bottom,0px))] sm:p-8 lg:pb-8">
            <Outlet />
          </div>
        </main>

        <nav className="fixed bottom-0 start-0 end-0 z-30 flex items-center justify-around border-t border-stone-200 bg-canvas-card px-1 py-2 safe-bottom dark:border-stone-800 lg:hidden">
          {mobileLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={"end" in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    "flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium",
                    isActive ? "text-brand-600" : "text-stone-500 dark:text-stone-400"
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="max-w-[72px] truncate">{item.label}</span>
              </NavLink>
            );
          })}
          </nav>
        </div>
      </div>
    </div>
  );
}
