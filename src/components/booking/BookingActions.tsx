import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import * as bookingService from "@/services/booking.service";
import { getApiErrorDetail } from "@/services/api";
import type { Booking } from "@/types/booking";
import { useAuthStore } from "@/store/authStore";

interface BookingActionsProps {
  booking: Booking;
  onUpdated: () => Promise<void> | void;
}

const ACTIVE_LIKE = new Set([
  "ACTIVE",
  "RETURN_SCHEDULED",
  "RETURNING",
  "INSPECTING",
]);

export function BookingActions({ booking, onUpdated }: BookingActionsProps) {
  const userId = useAuthStore((s) => s.user?.id);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [disputeReason, setDisputeReason] = useState("");

  const isOwner = userId === booking.owner.id;
  const isRenter = userId === booking.renter.id;

  async function run(
    action: () => Promise<unknown>,
    msg: string,
    after?: () => void
  ): Promise<void> {
    try {
      await action();
      toast.success(msg);
      await onUpdated();
      after?.();
    } catch (e) {
      toast.error(getApiErrorDetail(e).message);
    }
  }

  const canComplete = ACTIVE_LIKE.has(booking.status) && (isOwner || isRenter);
  const canStartRental = booking.status === "PAID" && isOwner;

  return (
    <div className="flex flex-wrap gap-2">
      {booking.status === "PENDING" && isOwner ? (
        <>
          <Button
            type="button"
            onClick={() =>
              void run(
                () => bookingService.approveBooking(booking.id),
                "Approved — renter can pay now"
              )
            }
          >
            Approve booking
          </Button>
          <Button type="button" variant="destructive" onClick={() => setRejectOpen(true)}>
            Reject
          </Button>
        </>
      ) : null}

      {booking.status === "PENDING" && isRenter ? (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void run(() => bookingService.cancelBooking(booking.id), "Booking cancelled")
          }
        >
          Cancel request
        </Button>
      ) : null}

      {canStartRental ? (
        <Button
          type="button"
          onClick={() =>
            void run(
              () => bookingService.ownerHandover(booking.id),
              "Rental started"
            )
          }
        >
          Start rental
        </Button>
      ) : null}

      {canComplete ? (
        <Button
          type="button"
          onClick={() =>
            void run(
              () => bookingService.completeRental(booking.id),
              "Rental completed"
            )
          }
        >
          Complete rental
        </Button>
      ) : null}

      {canComplete ? (
        <Button type="button" variant="destructive" onClick={() => setDisputeOpen(true)}>
          Report a problem
        </Button>
      ) : null}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject booking</DialogTitle>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Optional reason for the renter"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
              Close
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                void run(
                  () => bookingService.rejectBooking(booking.id, rejectReason || undefined),
                  "Rejected",
                  () => setRejectOpen(false)
                )
              }
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a problem</DialogTitle>
          </DialogHeader>
          <Textarea
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            placeholder="Describe the issue"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDisputeOpen(false)}>
              Close
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!disputeReason.trim()}
              onClick={() =>
                void run(
                  () => bookingService.raiseDispute(booking.id, disputeReason.trim()),
                  "Report submitted",
                  () => setDisputeOpen(false)
                )
              }
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
