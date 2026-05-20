import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user/UserAvatar";
import { RatingStars } from "@/components/user/RatingStars";
import type { Review } from "@/types/review";
import { formatDate } from "@/utils/dates";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
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
          </div>
          {review.comment ? (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
