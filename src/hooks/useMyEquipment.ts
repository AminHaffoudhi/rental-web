import { useCallback, useEffect, useState } from "react";
import * as equipmentService from "@/services/equipment.service";
import { getApiErrorDetail } from "@/services/api";
import type { Equipment } from "@/types/equipment";

export function useMyEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await equipmentService.listMyEquipment();
      setEquipment(data.items);
    } catch (e) {
      setError(new Error(getApiErrorDetail(e).message));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") {
        void refetch();
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refetch]);

  return { equipment, isLoading, error, refetch };
}
