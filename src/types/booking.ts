import type { Delivery } from "@/types/delivery";
import type { Equipment } from "@/types/equipment";
import type { Payment } from "@/types/payment";
import type { User } from "@/types/user";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PICKUP_SCHEDULED"
  | "IN_TRANSIT"
  | "ACTIVE"
  | "RETURN_SCHEDULED"
  | "RETURNING"
  | "INSPECTING"
  | "COMPLETED"
  | "DISPUTED"
  | "REFUNDED";

export interface Booking {
  id: string;
  renterId: string;
  ownerId: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  totalPrice: number;
  depositAmount: number;
  deliveryFee: number;
  platformFee: number;
  notes?: string | null;
  renter: User;
  owner: User;
  equipment: Equipment;
  delivery?: Delivery | null;
  payment?: Payment | null;
  createdAt: string;
}
