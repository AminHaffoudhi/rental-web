import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATE_DISPLAY } from "@/config/bookingStates";
import type { BookingStatus as BookingStatusValue } from "@/types/booking";
import { cn } from "@/utils/cn";

interface BookingStatusProps {
  status: BookingStatusValue;
}

export function BookingStatus({ status }: BookingStatusProps) {
  const { t } = useTranslation();
  const cfg = BOOKING_STATE_DISPLAY[status];
  const label = t(`bookingStatus.${status}`, { defaultValue: cfg.label });

  return (
    <Badge variant="outline" className={cn("border font-normal", cfg.color)}>
      {label}
    </Badge>
  );
}
