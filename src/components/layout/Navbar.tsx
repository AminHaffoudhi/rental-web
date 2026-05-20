import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, LayoutDashboard, LogOut, Menu, Search, Settings, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAvatar } from "@/components/user/UserAvatar";
import NotificationBell from "@/components/shared/NotificationBell";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const hideNavSearch = location.pathname === "/search";
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
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
          "sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-sm transition-all duration-300",
          scrolled && "shadow-md"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center gap-4 px-4 transition-all duration-300",
            scrolled ? "min-h-[60px] py-2 md:min-h-[60px]" : "min-h-[60px] py-3 md:min-h-[68px]"
          )}
        >
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden />
            <span className="font-display text-xl font-semibold text-brand-600 md:text-[1.35rem]">
              RentMarket
            </span>
          </Link>

          <div
            className={cn(
              "mx-auto max-w-[420px] flex-1 md:justify-center",
              hideNavSearch ? "hidden" : "hidden md:flex"
            )}
          >
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKeyDown}
                placeholder="Search equipment, tools, gear..."
                className={cn(
                  "input w-full rounded-full border-transparent bg-stone-100 py-2.5 pl-11 pr-4 transition-all duration-300",
                  "focus:border-brand-400 focus:bg-white focus:shadow-warm"
                )}
                aria-label="Search equipment"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            {!isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  List your equipment
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
                        className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-xl"
                        role="menu"
                      >
                        <div className="border-b border-stone-100 bg-stone-50 px-4 py-3">
                          <p className="truncate text-sm font-semibold text-stone-900">{user?.name}</p>
                          <p className="truncate text-xs text-stone-500">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4 shrink-0 text-stone-400" />
                            My Dashboard
                          </Link>
                          <Link
                            to="/bookings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <CalendarCheck className="h-4 w-4 shrink-0 text-stone-400" />
                            My Bookings
                          </Link>
                        </div>
                        <div className="mx-3 h-px bg-stone-100" />
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 shrink-0 text-stone-400" />
                            Profile & Settings
                          </Link>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
                            onClick={handleLogout}
                          >
                            <LogOut className="h-4 w-4 shrink-0" />
                            Logout
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
              aria-label="Open menu"
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
              className="max-h-[85vh] overflow-y-auto bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-4">
                <span className="font-display text-lg font-semibold text-brand-600">Menu</span>
                <button
                  type="button"
                  className="rounded-full p-2 text-stone-600 hover:bg-stone-100"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 px-4 py-6">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onSearchKeyDown}
                    placeholder="Search equipment, tools, gear..."
                    className="input w-full rounded-full border-transparent bg-stone-100 py-3 pl-11 pr-4 focus:bg-white focus:shadow-warm"
                  />
                </div>

                {!isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      className="btn btn-secondary w-full justify-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary w-full justify-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      List your equipment
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 border-t border-stone-100 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Account</p>
                    <Link
                      to="/dashboard"
                      className="rounded-lg px-3 py-2 text-stone-800 hover:bg-stone-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/bookings"
                      className="rounded-lg px-3 py-2 text-stone-800 hover:bg-stone-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      className="rounded-lg px-3 py-2 text-stone-800 hover:bg-stone-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      Profile & Settings
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                    >
                      Logout
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
