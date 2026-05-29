import type { EquipmentCategory } from "@/types/category";
import type { Review } from "@/types/review";
import type { User } from "@/types/user";

export type EquipmentApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Equipment {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category: EquipmentCategory;
  images: string[];
  imageKeys?: string[];
  dailyRate: number;
  weeklyRate?: number;
  depositAmount: number;
  deliveryFee: number;
  location: string;
  isAvailable: boolean;
  approvalStatus: EquipmentApprovalStatus;
  approvedAt?: string | null;
  rejectionNote?: string | null;
  ownerId?: string;
  owner: User;
  createdAt: string;
  reviews?: Review[];
  reviewCount?: number;
  averageRating?: number | null;
}

export type EquipmentDetail = Equipment;
