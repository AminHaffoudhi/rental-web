import { CalendarCheck, LayoutDashboard, Package, Settings, User, Wallet } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { isOwnerRole } from "@/lib/roles";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

export function useDashboardNav() {
  const { t, i18n } = useTranslation();
  const role = useAuthStore((s) => s.user?.role);
  const isOwner = isOwnerRole(role);

  return useMemo(() => {
    if (isOwner) {
      return {
        isOwner: true as const,
        sections: [
          {
            section: t("dashboard.sectionOverview"),
            links: [
              { to: "/dashboard", label: t("dashboard.overview"), icon: LayoutDashboard, end: true },
              { to: "/dashboard/listings", label: t("dashboard.myListings"), icon: Package },
              {
                to: "/dashboard/bookings",
                label: t("dashboard.bookingRequests"),
                icon: CalendarCheck,
              },
              { to: "/dashboard/earnings", label: t("dashboard.earnings"), icon: Wallet },
            ] as DashboardNavItem[],
          },
          {
            section: t("dashboard.sectionAccount"),
            links: [{ to: "/profile", label: t("dashboard.myProfile"), icon: User }],
          },
        ],
        mobileLinks: [
          { to: "/dashboard", label: t("dashboard.home"), icon: LayoutDashboard, end: true },
          { to: "/dashboard/listings", label: t("dashboard.listings"), icon: Package },
          { to: "/dashboard/bookings", label: t("dashboard.requests"), icon: CalendarCheck },
          { to: "/dashboard/earnings", label: t("dashboard.earnings"), icon: Wallet },
          { to: "/profile", label: t("dashboard.myProfile"), icon: User },
        ] as DashboardNavItem[],
        breadcrumbs: {
          "/dashboard": t("dashboard.overview"),
          "/dashboard/listings": t("dashboard.myListings"),
          "/dashboard/bookings": t("dashboard.bookingRequests"),
          "/dashboard/earnings": t("dashboard.earnings"),
          "/profile": t("dashboard.myProfile"),
          "/equipment/new": t("dashboard.newListing"),
        } as Record<string, string>,
      };
    }

    return {
      isOwner: false as const,
      sections: [
        {
          section: t("dashboard.sectionRentals"),
          links: [
            { to: "/dashboard", label: t("dashboard.renterOverview"), icon: LayoutDashboard, end: true },
            { to: "/bookings", label: t("nav.myBookings"), icon: CalendarCheck },
          ] as DashboardNavItem[],
        },
        {
          section: t("dashboard.sectionAccount"),
          links: [{ to: "/profile", label: t("nav.accountSettings"), icon: Settings }],
        },
      ],
      mobileLinks: [
        { to: "/dashboard", label: t("dashboard.renterOverview"), icon: LayoutDashboard, end: true },
        { to: "/bookings", label: t("dashboard.bookings"), icon: CalendarCheck },
        { to: "/profile", label: t("dashboard.settings"), icon: Settings },
      ] as DashboardNavItem[],
      breadcrumbs: {
        "/dashboard": t("dashboard.renterOverview"),
        "/profile": t("nav.accountSettings"),
      } as Record<string, string>,
    };
  }, [isOwner, t, i18n.language]);
}
