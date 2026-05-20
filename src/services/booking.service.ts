import { api, unwrap } from "@/services/api";
import type { Booking } from "@/types/booking";

export interface CreateBookingData {
  equipmentId: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
}

export async function getMyBookings(): Promise<{ asRenter: Booking[]; asOwner: Booking[] }> {
  const res = await api.get(`/bookings`);
  return unwrap(res);
}

export async function getBookingById(id: string): Promise<Booking> {
  const res = await api.get(`/bookings/${id}`);
  return unwrap(res);
}

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  const res = await api.post(`/bookings`, {
    equipmentId: data.equipmentId,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
    notes: data.notes,
  });
  return unwrap(res);
}

export async function approveBooking(id: string): Promise<Booking> {
  const res = await api.post(`/bookings/${id}/approve`);
  return unwrap(res);
}

export async function rejectBooking(id: string, reason?: string): Promise<Booking> {
  const res = await api.post(`/bookings/${id}/reject`, { reason });
  return unwrap(res);
}

export async function cancelBooking(id: string): Promise<Booking> {
  const res = await api.post(`/bookings/${id}/cancel`);
  return unwrap(res);
}

export async function confirmDelivery(id: string): Promise<Booking> {
  const res = await api.post(`/bookings/${id}/confirm-delivery`);
  return unwrap(res);
}

export async function requestReturn(id: string): Promise<Booking> {
  const res = await api.post(`/bookings/${id}/return-request`);
  return unwrap(res);
}

export async function raiseDispute(
  id: string,
  reason: string,
  evidence?: string[]
): Promise<Booking> {
  const res = await api.post(`/bookings/${id}/dispute`, { reason, evidence });
  return unwrap(res);
}
