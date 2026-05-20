import { Check } from "lucide-react";
import type { DeliveryStatus as DS } from "@/types/delivery";
import { cn } from "@/utils/cn";

const STEPS: { key: DS; label: string }[] = [
  { key: "SCHEDULED", label: "Scheduled" },
  { key: "PICKED_UP", label: "Picked up" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "RETURN_SCHEDULED", label: "Return scheduled" },
  { key: "RETURN_PICKED_UP", label: "Return picked up" },
  { key: "RETURNED", label: "Returned" },
];

interface DeliveryStatusProps {
  status: DS;
}

export function DeliveryStatus({ status }: DeliveryStatusProps) {
  const idx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="space-y-4">
      {STEPS.map((step, i) => {
        const done = i <= idx;
        return (
          <div key={step.key} className="flex gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                done
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <div>
              <p className={cn("font-medium", done ? "text-green-700" : "text-muted-foreground")}>
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
