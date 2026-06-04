import { endOfDay, parseISO, startOfDay } from "date-fns";
import type { Booking } from "@/types/booking";

const ONGOING_STATUSES = new Set([
  "ACTIVE",
  "PICKUP_SCHEDULED",
  "IN_TRANSIT",
  "RETURN_SCHEDULED",
  "RETURNING",
  "INSPECTING",
  "DISPUTED",
]);

const NEEDS_ACTION_STATUSES = new Set(["PENDING", "PAYMENT_PENDING", "CONFIRMED"]);

function rentalBounds(booking: Booking) {
  return {
    start: startOfDay(parseISO(booking.startDate)),
    end: endOfDay(parseISO(booking.endDate)),
  };
}

/** Classify a renter booking for dashboard cards (status + calendar dates). */
export function classifyRenterBooking(
  booking: Booking,
  now: Date = new Date()
): "active" | "upcoming" | "pending" | "completed" | "closed" {
  const { start, end } = rentalBounds(booking);
  const status = booking.status;

  if (status === "CANCELLED" || status === "REJECTED" || status === "REFUNDED") {
    return "closed";
  }

  if (NEEDS_ACTION_STATUSES.has(status)) {
    return "pending";
  }

  if (ONGOING_STATUSES.has(status)) {
    return now > end ? "completed" : "active";
  }

  if (status === "PAID") {
    if (now < start) return "upcoming";
    if (now <= end) return "active";
    return "completed";
  }

  if (status === "COMPLETED") {
    // Premature completion: rental period not over yet
    if (now <= end) {
      return now < start ? "upcoming" : "active";
    }
    return "completed";
  }

  return "closed";
}

export function summarizeRenterBookings(bookings: Booking[], now: Date = new Date()) {
  const counts = { active: 0, upcoming: 0, pending: 0, completed: 0 };
  let totalSpent = 0;

  for (const b of bookings) {
    const bucket = classifyRenterBooking(b, now);
    if (bucket === "active") counts.active++;
    else if (bucket === "upcoming") counts.upcoming++;
    else if (bucket === "pending") counts.pending++;
    else if (bucket === "completed") counts.completed++;

    if (
      ["PAID", "ACTIVE", "COMPLETED", "PICKUP_SCHEDULED", "IN_TRANSIT"].includes(b.status) &&
      b.payment?.status !== "REFUNDED"
    ) {
      totalSpent += b.totalPrice;
    }
  }

  return { ...counts, totalSpent };
}
