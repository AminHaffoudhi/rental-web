import { useCallback, useEffect, useState } from "react";
import type { EquipmentFilters } from "@/services/equipment.service";
import * as equipmentService from "@/services/equipment.service";
import { getApiErrorDetail } from "@/services/api";
import type { Equipment } from "@/types/equipment";

export function useEquipmentList(filters: EquipmentFilters) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const filterKey = JSON.stringify(filters);

  const refetch = useCallback(async () => {
    const parsed = JSON.parse(filterKey) as EquipmentFilters;
    setIsLoading(true);
    setError(null);
    try {
      const data = await equipmentService.searchEquipment(parsed);
      setEquipment(data.items);
      setTotal(data.total);
    } catch (e) {
      setError(new Error(getApiErrorDetail(e).message));
    } finally {
      setIsLoading(false);
    }
  }, [filterKey]);

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

  return { equipment, total, isLoading, error, refetch };
}

export function useEquipmentDetail(id: string | undefined) {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setEquipment(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await equipmentService.getEquipmentById(id);
      setEquipment(data);
    } catch (e: unknown) {
      setError(new Error(getApiErrorDetail(e).message));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible" && id) {
        void refetch();
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [id, refetch]);

  return { equipment, isLoading, error, refetch };
}
