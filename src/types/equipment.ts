import type { Review } from "@/types/review";
import type { User } from "@/types/user";


export type Category = "CONSTRUCTION" | "SPORTS" | "EVENTS" | "TOOLS" | "OTHER";

export interface Equipment {
  id: string;
  title: string;
  description: string;
  category: Category;
  images: string[];
  imageKeys?: string[];
  dailyRate: number;
  weeklyRate?: number;
  depositAmount: number;
  deliveryFee: number;
  location: string;
  isAvailable: boolean;
  ownerId?: string;
  owner: User;
  createdAt: string;
  reviews?: Review[];
}

export type EquipmentDetail = Equipment;
