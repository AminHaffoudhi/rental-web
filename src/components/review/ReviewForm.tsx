import { Loader2, Star } from "lucide-react";
import { useState, type ReactElement } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorDetail } from "@/services/api";
import * as reviewService from "@/services/review.service";
import { cn } from "@/utils/cn";

export function ReviewForm(props: {
  variant: "owner" | "equipment" | "booking";
  revieweeId?: string;
  equipmentId?: string;
  bookingId?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}): ReactElement {
  const {
    variant,
    revieweeId,
    equipmentId,
    bookingId,
    title = "Leave a review",
    description = "Your review will be visible after admin approval.",
    onSuccess,
  } = props;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (variant === "owner" && revieweeId) {
        await reviewService.createOwnerReview({ revieweeId, rating, comment: comment.trim() || undefined });
      } else if (variant === "equipment" && equipmentId) {
        await reviewService.createEquipmentReview({
          equipmentId,
          rating,
          comment: comment.trim() || undefined,
        });
      } else if (variant === "booking" && bookingId && revieweeId && equipmentId) {
        await reviewService.createBookingOwnerReview({
          bookingId,
          revieweeId,
          equipmentId,
          rating,
          comment: comment.trim() || undefined,
        });
      } else {
        throw new Error("Invalid review form configuration");
      }
      toast.success("Review submitted — thank you!");
      setComment("");
      onSuccess?.();
    } catch (err) {
      toast.error(getApiErrorDetail(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 text-sm text-stone-500">{description}</p>
      <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-stone-700">Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="rounded-md p-1 transition-colors"
                aria-label={`${n} stars`}
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    n <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300 hover:text-amber-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-stone-700">
            Comment (optional)
          </label>
          <Textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience…"
            className="input resize-y text-sm"
            maxLength={1000}
          />
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
          {submitting ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit review"
          )}
        </button>
      </form>
    </section>
  );
}
