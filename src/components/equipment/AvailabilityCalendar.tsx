import { format, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

interface AvailabilityCalendarProps {
  bookedDates: string[];
  range: DateRange | undefined;
  onRangeSelect: (range: DateRange | undefined) => void;
}

export function AvailabilityCalendar({
  bookedDates,
  range,
  onRangeSelect,
}: AvailabilityCalendarProps) {
  const bookedSet = new Set(bookedDates);

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={onRangeSelect}
      numberOfMonths={1}
      disabled={(date) => bookedSet.has(format(date, "yyyy-MM-dd"))}
      defaultMonth={
        range?.from ??
        (bookedDates[0] ? parseISO(bookedDates[0]) : new Date())
      }
    />
  );
}
