import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { isOwnerRole } from "@/lib/roles";

/** Blocks pure renters from owner dashboard routes (listings, earnings, new listing, etc.). */
export function OwnerOnlyRoute() {
  const role = useAuthStore((s) => s.user?.role);
  if (!isOwnerRole(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
