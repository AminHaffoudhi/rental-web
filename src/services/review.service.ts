import { api, unwrap } from "@/services/api";

export interface CreateReviewData {
  bookingId: string;
  revieweeId: string;
  equipmentId: string;
  rating: number;
  comment?: string;
}

export async function createOwnerReview(data: {
  revieweeId: string;
  rating: number;
  comment?: string;
}): Promise<void> {
  const res = await api.post("/reviews/owner", data);
  unwrap(res);
}

export async function createEquipmentReview(data: {
  equipmentId: string;
  rating: number;
  comment?: string;
}): Promise<void> {
  const res = await api.post("/reviews/equipment", data);
  unwrap(res);
}

export async function createBookingOwnerReview(data: CreateReviewData): Promise<void> {
  const res = await api.post("/reviews/booking", {
    ...data,
    type: "OWNER",
  });
  unwrap(res);
}

export async function createBookingEquipmentReview(data: CreateReviewData): Promise<void> {
  const res = await api.post("/reviews/booking", {
    ...data,
    type: "EQUIPMENT",
  });
  unwrap(res);
}

/** @deprecated */
export async function createReview(data: CreateReviewData): Promise<void> {
  const res = await api.post("/reviews", data);
  unwrap(res);
}
