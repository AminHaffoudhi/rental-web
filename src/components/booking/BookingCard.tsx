import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStatus } from "@/components/booking/BookingStatus";
import type { Booking } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import { formatDateRange } from "@/utils/dates";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <Link to={`/bookings/${booking.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{booking.equipment.title}</p>
            <p className="text-sm text-muted-foreground">
              {formatDateRange(booking.startDate, booking.endDate)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BookingStatus status={booking.status} />
            <span className="font-semibold">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
