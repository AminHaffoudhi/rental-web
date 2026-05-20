import { Badge } from "@/components/ui/badge";
import { BOOKING_STATE_DISPLAY } from "@/config/bookingStates";
import type { BookingStatus as BookingStatusValue } from "@/types/booking";
import { cn } from "@/utils/cn";

interface BookingStatusProps {
  status: BookingStatusValue;
}

export function BookingStatus({ status }: BookingStatusProps) {
  const cfg = BOOKING_STATE_DISPLAY[status];
  return (
    <Badge variant="outline" className={cn("border font-normal", cfg.color)}>
      {cfg.label}
    </Badge>
  );
}
