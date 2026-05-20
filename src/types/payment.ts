export type PaymentStatus = "PENDING" | "CONFIRMED" | "PAYOUT_PENDING" | "PAYOUT_SENT";

export interface Payment {
  id: string;
  amount: number;
  depositAmount: number;
  status: PaymentStatus;
  confirmedAt?: string | null;
  payoutSentAt?: string | null;
}
