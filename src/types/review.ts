import type { User } from "@/types/user";

export type ReviewType = "OWNER" | "EQUIPMENT";
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id: string;
  type?: ReviewType;
  status?: ReviewStatus;
  rating: number;
  comment?: string | null;
  createdAt: string;
  reviewer: Pick<User, "id" | "name" | "image">;
  equipment?: { id: string; title: string } | null;
}
