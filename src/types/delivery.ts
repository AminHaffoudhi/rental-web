export type DeliveryStatus =
  | "SCHEDULED"
  | "PICKED_UP"
  | "DELIVERED"
  | "RETURN_SCHEDULED"
  | "RETURN_PICKED_UP"
  | "RETURNED";

export interface Delivery {
  id: string;
  bookingId?: string;
  agentName?: string | null;
  agentPhone?: string | null;
  pickupPhotos: string[];
  returnPhotos: string[];
  status: DeliveryStatus;
  deliverySlot?: string | null;
  returnSlot?: string | null;
}
