import { api, unwrap } from "@/services/api";
import type { Category, Equipment } from "@/types/equipment";
import { datesInRange } from "@/utils/dates";

export type EquipmentSort = "recent" | "price_asc" | "price_desc" | "rating";

export interface EquipmentFilters {
  q?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  limit?: number;
  page?: number;
  pageSize?: number;
  sort?: EquipmentSort;
  /** When false, include unavailable equipment (default: only available). */
  availableOnly?: boolean;
}

export interface EquipmentSearchResult {
  items: Equipment[];
  total: number;
}

export interface CreateEquipmentData {
  title: string;
  description: string;
  category: Category;
  dailyRate: number;
  weeklyRate?: number;
  depositAmount: number;
  deliveryFee: number;
  location: string;
  images?: string[];
  imageKeys?: string[];
}

function serializeFilters(filters: EquipmentFilters): Record<string, unknown> {
  const { availableOnly, ...rest } = filters;
  return {
    ...rest,
    ...(availableOnly === false ? { availableOnly: "false" } : {}),
    ...(availableOnly === true ? { availableOnly: "true" } : {}),
  };
}

export async function searchEquipment(filters: EquipmentFilters): Promise<EquipmentSearchResult> {
  const res = await api.get(`/equipment`, { params: serializeFilters(filters) });
  return unwrap(res);
}

export async function getEquipmentById(id: string): Promise<Equipment> {
  const res = await api.get(`/equipment/${id}`);
  return unwrap(res);
}

export async function createEquipment(data: CreateEquipmentData): Promise<Equipment> {
  const res = await api.post(`/equipment`, data);
  return unwrap(res);
}

export async function updateEquipment(
  id: string,
  data: Partial<CreateEquipmentData> & { isAvailable?: boolean }
): Promise<Equipment> {
  const res = await api.put(`/equipment/${id}`, data);
  return unwrap(res);
}

export async function deleteEquipment(id: string): Promise<void> {
  await api.delete(`/equipment/${id}`);
}

export async function getAvailability(id: string, month: string): Promise<string[]> {
  const res = await api.get(`/equipment/${id}/availability`, {
    params: { month },
  });
  const data = unwrap<{ month: string; ranges: Array<{ startDate: string; endDate: string }> }>(
    res
  );
  const booked = new Set<string>();
  for (const r of data.ranges) {
    for (const d of datesInRange(r.startDate, r.endDate)) {
      booked.add(d);
    }
  }
  return [...booked];
}
