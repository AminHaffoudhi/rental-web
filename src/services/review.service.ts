import { api, unwrap } from "@/services/api";

export interface CreateReviewData {
  bookingId: string;
  revieweeId: string;
  equipmentId: string;
  rating: number;
  comment?: string;
}

export async function createReview(data: CreateReviewData): Promise<void> {
  const res = await api.post(`/reviews`, data);
  unwrap(res);
}
