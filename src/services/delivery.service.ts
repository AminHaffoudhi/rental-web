import { api, unwrap } from "@/services/api";
import type { Delivery } from "@/types/delivery";

export async function getDelivery(id: string): Promise<Delivery> {
  const res = await api.get(`/delivery/${id}`);
  const row = unwrap(res) as Delivery & { booking?: unknown };
  const { booking: _b, ...rest } = row;
  return rest;
}

export async function uploadPickupPhotos(id: string, photos: string[]): Promise<Delivery> {
  const res = await api.post(`/delivery/${id}/pickup-photos`, { photos });
  return unwrap(res);
}

export async function uploadReturnPhotos(id: string, photos: string[]): Promise<Delivery> {
  const res = await api.post(`/delivery/${id}/return-photos`, { photos });
  return unwrap(res);
}
