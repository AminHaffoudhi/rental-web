import type { Equipment } from "@/types/equipment";
import type { Review } from "@/types/review";

export function equipmentReviewStats(equipment: Equipment): {
  count: number;
  average: number | null;
  approvedReviews: Review[];
} {
  const approvedReviews = (equipment.reviews ?? []).filter(
    (r) => !r.status || r.status === "APPROVED"
  );
  const count = equipment.reviewCount ?? approvedReviews.length;
  const average =
    equipment.averageRating ??
    (count > 0
      ? approvedReviews.reduce((s, r) => s + r.rating, 0) / count
      : null);
  return { count, average, approvedReviews };
}
