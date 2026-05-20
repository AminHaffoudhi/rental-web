import { Check } from "lucide-react";
import type { BookingStatus } from "@/types/booking";
import { cn } from "@/utils/cn";

const STEPS = [
  "Requested",
  "Confirmed",
  "Paid",
  "Pickup scheduled",
  "In transit",
  "Active",
  "Return scheduled",
  "Returning",
  "Inspecting",
  "Completed",
];

function getStepIndex(status: BookingStatus): number | null {
  switch (status) {
    case "PENDING":
      return 0;
    case "CONFIRMED":
      return 1;
    case "PAYMENT_PENDING":
    case "PAID":
      return 2;
    case "PICKUP_SCHEDULED":
      return 3;
    case "IN_TRANSIT":
      return 4;
    case "ACTIVE":
      return 5;
    case "RETURN_SCHEDULED":
      return 6;
    case "RETURNING":
      return 7;
    case "INSPECTING":
      return 8;
    case "COMPLETED":
      return 9;
    default:
      return null;
  }
}

interface BookingTimelineProps {
  status: BookingStatus;
}

export function BookingTimeline({ status }: BookingTimelineProps) {
  const idx = getStepIndex(status);

  if (status === "DISPUTED") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        <p className="font-semibold">Dispute in progress</p>
        <p className="mt-1 text-red-800/90">
          This booking is under dispute. Contact support if you need help.
        </p>
      </div>
    );
  }

  if (idx === null) {
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
        <p className="font-medium">
          {status === "REJECTED"
            ? "This booking was rejected."
            : status === "CANCELLED"
              ? "This booking was cancelled."
              : status === "REFUNDED"
                ? "This booking was refunded."
                : "This booking did not complete."}
        </p>
      </div>
    );
  }

  return (
    <ul className="relative space-y-0 border-l border-stone-200 pl-6">
      {STEPS.map((label, i) => {
        const complete = status === "COMPLETED" || i < idx;
        const current = status !== "COMPLETED" && i === idx;
        const pending = !complete && !current;

        return (
          <li key={label} className="relative pb-8 last:pb-0">
            <span
              className={cn(
                "absolute -left-[13px] top-0 flex h-[26px] w-[26px] -translate-x-1/2 items-center justify-center rounded-full border-2 text-[10px] font-semibold",
                complete
                  ? "border-green-600 bg-green-600 text-white"
                  : current
                    ? "border-brand-500 bg-brand-500 text-white shadow-[0_0_0_4px_rgba(249,115,22,0.22)]"
                    : "border-stone-300 bg-white text-stone-400"
              )}
            >
              {complete ? (
                <Check className="h-3.5 w-3.5" />
              ) : current ? (
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              ) : (
                <span className="tabular-nums">{i + 1}</span>
              )}
            </span>
            <div className="min-w-0 pl-1">
              <p
                className={cn(
                  "text-sm font-medium leading-tight",
                  pending ? "text-stone-400" : "text-stone-900"
                )}
              >
                {label}
              </p>
              {current ? (
                <p className="mt-0.5 text-xs text-brand-700">Current stage</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
