import { api, unwrap } from "@/services/api";
import type { EquipmentCategory } from "@/types/category";

export async function listCategories(): Promise<EquipmentCategory[]> {
  const res = await api.get("/categories");
  return unwrap(res) as EquipmentCategory[];
}
