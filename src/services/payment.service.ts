import { api, unwrap } from "@/services/api";
import type { Payment } from "@/types/payment";

export async function getPaymentByBooking(bookingId: string): Promise<Payment> {
  const res = await api.get(`/payments/booking/${bookingId}`);
  return unwrap(res);
}
