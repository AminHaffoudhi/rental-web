import { useCallback, useEffect, useState } from "react";
import * as bookingService from "@/services/booking.service";
import type { Booking } from "@/types/booking";

export function useMyBookings() {
  const [bookings, setBookings] = useState<{
    asRenter: Booking[];
    asOwner: Booking[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load bookings"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { bookings, isLoading, error, refetch };
}

export function useBookingDetail(id: string | undefined) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookingById(id);
      setBooking(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load booking"));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { booking, isLoading, error, refetch };
}
