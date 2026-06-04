import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { BookingStripePayButton } from "@/components/booking/BookingStripePayButton";
import * as bookingService from "@/services/booking.service";
import { getApiErrorDetail } from "@/services/api";
import type { Booking } from "@/types/booking";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

interface BookingActionsProps {
  booking: Booking;
  onUpdated: () => Promise<void> | void;
  className?: string;
}

const ACTIVE_LIKE = new Set([
  "ACTIVE",
  "RETURN_SCHEDULED",
  "RETURNING",
  "INSPECTING",
]);

const TERMINAL = new Set(["REJECTED", "CANCELLED", "REFUNDED", "COMPLETED"]);

export function bookingHasSidebarActions(
  booking: Booking,
  userId: string | undefined
): boolean {
  if (!userId) return false;
  const isOwner = userId === booking.owner.id;
  const isRenter = userId === booking.renter.id;
  if (!isOwner && !isRenter) return false;

  if (booking.status === "PENDING" && (isOwner || isRenter)) return true;
  if (booking.status === "PAYMENT_PENDING") return true;
  if (booking.status === "PAID" && isOwner) return true;
  if (ACTIVE_LIKE.has(booking.status)) return true;
  if (TERMINAL.has(booking.status)) return true;
  if (booking.status === "PAID" && isRenter) return true;
  if (booking.status === "DISPUTED") return true;
  return false;
}

function ActionHint({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-stone-600 dark:text-stone-400", className)}>{children}</p>
  );
}

export function BookingActions({ booking, onUpdated, className }: BookingActionsProps) {
  const { t } = useTranslation();
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
  const canCancelPaymentPending = booking.status === "PAYMENT_PENDING" && isRenter;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {booking.status === "PENDING" && isOwner ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() =>
              void run(
                () => bookingService.approveBooking(booking.id),
                t("bookings.toastApproved")
              )
            }
          >
            {t("bookings.approveBooking")}
          </Button>
          <Button type="button" variant="destructive" onClick={() => setRejectOpen(true)}>
            {t("bookings.rejectBooking")}
          </Button>
        </div>
      ) : null}

      {booking.status === "PENDING" && isRenter ? (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void run(() => bookingService.cancelBooking(booking.id), t("bookings.toastCancelled"))
          }
        >
          {t("bookings.cancelRequest")}
        </Button>
      ) : null}

      {booking.status === "PAYMENT_PENDING" && isRenter ? (
        <>
          <ActionHint>{t("bookings.actionPayHint")}</ActionHint>
          <BookingStripePayButton booking={booking} fullWidth />
          {canCancelPaymentPending ? (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void run(
                  () => bookingService.cancelBooking(booking.id),
                  t("bookings.toastCancelled")
                )
              }
            >
              {t("bookings.cancelRequest")}
            </Button>
          ) : null}
        </>
      ) : null}

      {booking.status === "PAYMENT_PENDING" && isOwner ? (
        <ActionHint>{t("bookings.actionAwaitingPayment")}</ActionHint>
      ) : null}

      {booking.status === "PAID" && isOwner ? (
        <Button
          type="button"
          onClick={() =>
            void run(() => bookingService.ownerHandover(booking.id), t("bookings.toastRentalStarted"))
          }
        >
          {t("bookings.startRental")}
        </Button>
      ) : null}

      {booking.status === "PAID" && isRenter ? (
        <ActionHint>{t("bookings.actionAwaitingHandover")}</ActionHint>
      ) : null}

      {canComplete ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() =>
              void run(
                () => bookingService.completeRental(booking.id),
                t("bookings.toastRentalCompleted")
              )
            }
          >
            {t("bookings.completeRental")}
          </Button>
          <Button type="button" variant="destructive" onClick={() => setDisputeOpen(true)}>
            {t("bookings.reportProblem")}
          </Button>
        </div>
      ) : null}

      {booking.status === "REJECTED" ? (
        <>
          <ActionHint>
            {isOwner ? t("bookings.actionRejectedOwner") : t("bookings.actionRejectedRenter")}
          </ActionHint>
          <Button type="button" variant="outline" asChild>
            <Link to="/search">{t("bookings.browseEquipment")}</Link>
          </Button>
        </>
      ) : null}

      {booking.status === "CANCELLED" ? (
        <>
          <ActionHint>{t("bookings.actionCancelled")}</ActionHint>
          <Button type="button" variant="outline" asChild>
            <Link to="/search">{t("bookings.browseEquipment")}</Link>
          </Button>
        </>
      ) : null}

      {booking.status === "COMPLETED" && isRenter ? (
        <Button type="button" variant="outline" asChild>
          <Link to={`/bookings/${booking.id}#review`}>{t("bookingCard.leaveReview")}</Link>
        </Button>
      ) : null}

      {booking.status === "DISPUTED" ? (
        <ActionHint>{t("bookings.actionDisputed")}</ActionHint>
      ) : null}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bookings.rejectDialogTitle")}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t("bookings.rejectReasonPlaceholder")}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
              {t("common.close")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                void run(
                  () => bookingService.rejectBooking(booking.id, rejectReason || undefined),
                  t("bookings.toastRejected"),
                  () => setRejectOpen(false)
                )
              }
            >
              {t("bookings.rejectBooking")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bookings.disputeDialogTitle")}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            placeholder={t("bookings.disputeReasonPlaceholder")}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDisputeOpen(false)}>
              {t("common.close")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!disputeReason.trim()}
              onClick={() =>
                void run(
                  () => bookingService.raiseDispute(booking.id, disputeReason.trim()),
                  t("bookings.toastDisputeSubmitted"),
                  () => setDisputeOpen(false)
                )
              }
            >
              {t("bookings.disputeSubmit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
