import { useCallback, useEffect, useState } from "react";
import * as ownerDashboardService from "@/services/ownerDashboard.service";
import { useAuthStore } from "@/store/authStore";
import type { OwnerDashboardData } from "@/types/ownerDashboard";

export function useOwnerDashboard() {
  const role = useAuthStore((s) => s.user?.role);
  const canFetch = role === "OWNER" || role === "BOTH" || role === "ADMIN";

  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(canFetch);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!canFetch) {
      setData(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await ownerDashboardService.getOwnerDashboard();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load dashboard"));
    } finally {
      setIsLoading(false);
    }
  }, [canFetch]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch, canFetch };
}
