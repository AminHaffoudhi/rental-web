import { api, unwrap } from "@/services/api";
import type { OwnerDashboardData } from "@/types/ownerDashboard";

export async function getOwnerDashboard(): Promise<OwnerDashboardData> {
  const res = await api.get("/owner/dashboard");
  return unwrap(res);
}
