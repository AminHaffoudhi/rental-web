import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user/UserAvatar";
import { RatingStars } from "@/components/user/RatingStars";
import type { Review } from "@/types/review";
import { formatDate } from "@/utils/dates";

interface ReviewCardProps {
  review: Review;
  showStatus?: boolean;
}

export function ReviewCard({ review, showStatus }: ReviewCardProps) {
  const pending = showStatus && review.status && review.status !== "APPROVED";
  return (
    <Card>
      <CardContent className="flex gap-4 pt-6">
        <UserAvatar user={review.reviewer} size="sm" />
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{review.reviewer.name}</span>
            <RatingStars rating={review.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </span>
            {pending ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                {review.status === "REJECTED" ? "Rejected" : "Pending approval"}
              </span>
            ) : null}
          </div>
          {review.type === "EQUIPMENT" && review.equipment ? (
            <p className="text-xs text-muted-foreground">
              Listing:{" "}
              <Link
                to={`/equipment/${review.equipment.id}`}
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                {review.equipment.title}
              </Link>
            </p>
          ) : null}
          {review.comment ? (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
