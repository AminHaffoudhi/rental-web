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

  return { equipment, total, isLoading, error, refetch };
}

export function useEquipmentDetail(id: string | undefined) {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setEquipment(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    void equipmentService
      .getEquipmentById(id)
      .then((data) => {
        if (!cancelled) setEquipment(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(new Error(getApiErrorDetail(e).message));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { equipment, isLoading, error };
}
