import { Check } from "lucide-react";
import type { BookingStatus } from "@/types/booking";
import { cn } from "@/utils/cn";

const STEPS = ["Requested", "Pay", "Active rental", "Completed"] as const;

function getStepIndex(status: BookingStatus): number | null {
  switch (status) {
    case "PENDING":
      return 0;
    case "CONFIRMED":
    case "PAYMENT_PENDING":
      return 1;
    case "PAID":
    case "PICKUP_SCHEDULED":
    case "IN_TRANSIT":
      return 2;
    case "ACTIVE":
    case "RETURN_SCHEDULED":
    case "RETURNING":
    case "INSPECTING":
      return 2;
    case "COMPLETED":
      return 3;
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
        <p className="mt-1 text-red-800/90">Contact support if you need help.</p>
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
        const complete = status === "COMPLETED" ? i <= 3 : i < idx;
        const current = status !== "COMPLETED" && i === idx;

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
                  complete || current ? "text-stone-900" : "text-stone-400"
                )}
              >
                {label}
              </p>
              {current ? (
                <p className="mt-0.5 text-xs text-brand-700">Current step</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
