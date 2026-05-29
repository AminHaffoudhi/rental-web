import { useCallback, useEffect, useState } from "react";
import * as categoryService from "@/services/category.service";
import { getApiErrorDetail } from "@/services/api";
import type { EquipmentCategory } from "@/types/category";

export function useCategories() {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.listCategories();
      setCategories(data);
    } catch (e) {
      setError(getApiErrorDetail(e).message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { categories, isLoading, error, refetch };
}
