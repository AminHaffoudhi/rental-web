import type { User } from "@/types/user";

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  reviewer: Pick<User, "id" | "name" | "image">;
  equipment?: { id: string; title: string };
}
