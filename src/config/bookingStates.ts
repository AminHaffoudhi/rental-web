import type { BookingStatus } from "@/types/booking";

export const BOOKING_STATE_DISPLAY: Record<
  BookingStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Pending", color: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/15 text-blue-700 border-blue-500/30" },
  REJECTED: { label: "Rejected", color: "bg-rose-500/15 text-rose-700 border-rose-500/30" },
  CANCELLED: { label: "Cancelled", color: "bg-muted text-muted-foreground border-border" },
  PAYMENT_PENDING: {
    label: "Payment pending",
    color: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  },
  PAID: { label: "Paid", color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" },
  PICKUP_SCHEDULED: {
    label: "Pickup scheduled",
    color: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  },
  IN_TRANSIT: { label: "In transit", color: "bg-teal-500/15 text-teal-700 border-teal-500/30" },
  ACTIVE: { label: "Active", color: "bg-green-500/15 text-green-700 border-green-500/30" },
  RETURN_SCHEDULED: {
    label: "Return scheduled",
    color: "bg-indigo-500/15 text-indigo-700 border-indigo-500/30",
  },
  RETURNING: { label: "Returning", color: "bg-violet-500/15 text-violet-700 border-violet-500/30" },
  INSPECTING: { label: "Inspecting", color: "bg-slate-500/15 text-slate-700 border-slate-500/30" },
  COMPLETED: { label: "Completed", color: "bg-green-600/15 text-green-800 border-green-600/30" },
  DISPUTED: { label: "Disputed", color: "bg-red-500/15 text-red-700 border-red-500/30" },
  REFUNDED: { label: "Refunded", color: "bg-zinc-500/15 text-zinc-700 border-zinc-500/30" },
};
