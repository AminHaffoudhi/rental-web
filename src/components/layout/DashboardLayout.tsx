import {
  CalendarCheck,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "@/components/shared/NotificationBell";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

const navSections = [
  {
    section: "OVERVIEW",
    links: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/dashboard/listings", label: "My Listings", icon: Package },
      { to: "/dashboard/bookings", label: "Booking Requests", icon: CalendarCheck },
      { to: "/dashboard/earnings", label: "Earnings", icon: Wallet },
    ],
  },
  {
    section: "ACCOUNT",
    links: [{ to: "/profile", label: "My Profile", icon: User }],
  },
] as const;

function DashboardBreadcrumb() {
  const location = useLocation();
  const crumbs: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/listings": "My Listings",
    "/dashboard/bookings": "Booking Requests",
    "/dashboard/earnings": "Earnings",
    "/profile": "My Profile",
    "/equipment/new": "New Listing",
  };
  const label = crumbs[location.pathname] ?? "Dashboard";
  return (
    <div>
      <p className="text-xs font-medium text-stone-400">RentMarket</p>
      <h1 className="font-display text-lg font-semibold leading-tight text-stone-900">{label}</h1>
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-stone-800 px-6 py-5">
        <NavLink to="/" className="flex items-center gap-2" onClick={onNavigate}>
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
          <span className="font-display text-lg font-semibold tracking-tight text-white">RentMarket</span>
        </NavLink>
      </div>

      <div className="px-4 pb-3 pt-5">
        <NavLink
          to="/equipment/new"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-warm transition-all duration-200 hover:bg-brand-600 hover:shadow-md"
        >
          <Plus size={16} />
          Add New Listing
        </NavLink>
      </div>

      <nav className="mt-2 min-h-0 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navSections.map((block) => (
          <div key={block.section}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">
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
                          ? "border-l-2 border-brand-500 bg-brand-500/15 pl-[10px] text-brand-400"
                          : "border-l-2 border-transparent text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={17}
                          className={cn(
                            isActive ? "text-brand-400" : "text-stone-500 group-hover:text-stone-300"
                          )}
                        />
                        {item.label}
                        {isActive ? (
                          <ChevronRight size={14} className="ml-auto text-brand-500/60" />
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
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    <div className="flex h-[100dvh] overflow-hidden bg-stone-50">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-60 shrink-0 flex-col bg-stone-900 transition-transform duration-200 lg:static lg:h-auto lg:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <button
          type="button"
          className="absolute right-3 top-4 rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-white lg:hidden"
          onClick={closeMobile}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
        <SidebarNav onNavigate={closeMobile} />
        <div className="mt-auto border-t border-stone-800 p-4">
          <div className="mb-3 flex items-center gap-3">
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-200">{user?.name}</p>
              <p className="truncate text-xs text-stone-500">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-500 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="relative z-30 flex h-16 shrink-0 items-center justify-between overflow-visible border-b border-stone-100 bg-white px-4 shadow-sm sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu size={20} />
            </button>
            <DashboardBreadcrumb />
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <NavLink to="/profile" className="rounded-full ring-offset-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <UserAvatar user={user} size="sm" />
            </NavLink>
          </div>
        </header>

        <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto w-full max-w-7xl p-6 pb-[max(5.5rem,env(safe-area-inset-bottom,0px))] sm:p-8 lg:pb-8">
            <Outlet />
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-stone-200 bg-white px-1 py-2 safe-bottom lg:hidden">
          {navSections[0].links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={"end" in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    "flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium",
                    isActive ? "text-brand-600" : "text-stone-500"
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="max-w-[64px] truncate">{item.label.split(" ")[0]}</span>
              </NavLink>
            );
          })}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium",
                isActive ? "text-brand-600" : "text-stone-500"
              )
            }
          >
            <User className="h-5 w-5" />
            Profile
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
