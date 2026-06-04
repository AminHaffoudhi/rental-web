import type { BookingStatus } from "@/types/booking";

export const BOOKING_STATE_DISPLAY: Record<
  BookingStatus,
  { label: string; color: string }
> = {
  PENDING: {
    label: "Pending",
    color:
      "bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-300 dark:border-amber-500/40",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-500/15 text-blue-800 border-blue-500/30 dark:text-blue-300 dark:border-blue-500/40",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-rose-500/15 text-rose-800 border-rose-500/30 dark:text-rose-300 dark:border-rose-500/40",
  },
  CANCELLED: {
    label: "Cancelled",
    color:
      "bg-stone-500/10 text-stone-600 border-stone-300 dark:bg-stone-500/15 dark:text-stone-400 dark:border-stone-600",
  },
  PAYMENT_PENDING: {
    label: "Payment pending",
    color:
      "bg-orange-500/15 text-orange-800 border-orange-500/30 dark:text-orange-300 dark:border-orange-500/40",
  },
  PAID: {
    label: "Paid",
    color:
      "bg-emerald-500/15 text-emerald-800 border-emerald-500/30 dark:text-emerald-300 dark:border-emerald-500/40",
  },
  PICKUP_SCHEDULED: {
    label: "Pickup scheduled",
    color: "bg-cyan-500/15 text-cyan-800 border-cyan-500/30 dark:text-cyan-300 dark:border-cyan-500/40",
  },
  IN_TRANSIT: {
    label: "In transit",
    color: "bg-teal-500/15 text-teal-800 border-teal-500/30 dark:text-teal-300 dark:border-teal-500/40",
  },
  ACTIVE: {
    label: "Active",
    color:
      "bg-green-500/15 text-green-800 border-green-500/30 dark:text-green-300 dark:border-green-500/40",
  },
  RETURN_SCHEDULED: {
    label: "Return scheduled",
    color:
      "bg-indigo-500/15 text-indigo-800 border-indigo-500/30 dark:text-indigo-300 dark:border-indigo-500/40",
  },
  RETURNING: {
    label: "Returning",
    color:
      "bg-violet-500/15 text-violet-800 border-violet-500/30 dark:text-violet-300 dark:border-violet-500/40",
  },
  INSPECTING: {
    label: "Inspecting",
    color:
      "bg-slate-500/15 text-slate-800 border-slate-500/30 dark:text-slate-300 dark:border-slate-500/40",
  },
  COMPLETED: {
    label: "Completed",
    color:
      "bg-green-600/15 text-green-900 border-green-600/30 dark:text-green-300 dark:border-green-500/40",
  },
  DISPUTED: {
    label: "Disputed",
    color: "bg-red-500/15 text-red-800 border-red-500/30 dark:text-red-300 dark:border-red-500/40",
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-zinc-500/15 text-zinc-800 border-zinc-500/30 dark:text-zinc-300 dark:border-zinc-500/40",
  },
};
