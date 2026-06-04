import { CalendarCheck, LayoutDashboard, Package, Settings, User, Wallet } from "lucide-react";
import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { isOwnerRole } from "@/lib/roles";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

export function useDashboardNav() {
  const role = useAuthStore((s) => s.user?.role);
  const isOwner = isOwnerRole(role);

  return useMemo(() => {
    if (isOwner) {
      return {
        isOwner: true as const,
        sections: [
          {
            section: "OVERVIEW",
            links: [
              { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
              { to: "/dashboard/listings", label: "My Listings", icon: Package },
              { to: "/dashboard/bookings", label: "Booking Requests", icon: CalendarCheck },
              { to: "/dashboard/earnings", label: "Earnings", icon: Wallet },
            ] as DashboardNavItem[],
          },
          {
            section: "ACCOUNT",
            links: [{ to: "/profile", label: "My Profile", icon: User }],
          },
        ],
        mobileLinks: [
          { to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true },
          { to: "/dashboard/listings", label: "Listings", icon: Package },
          { to: "/dashboard/bookings", label: "Requests", icon: CalendarCheck },
          { to: "/dashboard/earnings", label: "Earnings", icon: Wallet },
          { to: "/profile", label: "Profile", icon: User },
        ] as DashboardNavItem[],
        breadcrumbs: {
          "/dashboard": "Overview",
          "/dashboard/listings": "My Listings",
          "/dashboard/bookings": "Booking Requests",
          "/dashboard/earnings": "Earnings",
          "/profile": "My Profile",
          "/equipment/new": "New Listing",
        } as Record<string, string>,
      };
    }

    return {
      isOwner: false as const,
      sections: [
        {
          section: "MY RENTALS",
          links: [
            { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
            { to: "/bookings", label: "My Bookings", icon: CalendarCheck },
          ] as DashboardNavItem[],
        },
        {
          section: "ACCOUNT",
          links: [{ to: "/profile", label: "Account settings", icon: Settings }],
        },
      ],
      mobileLinks: [
        { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
        { to: "/bookings", label: "Bookings", icon: CalendarCheck },
        { to: "/profile", label: "Settings", icon: Settings },
      ] as DashboardNavItem[],
      breadcrumbs: {
        "/dashboard": "Overview",
        "/profile": "Account settings",
      } as Record<string, string>,
    };
  }, [isOwner]);
}
