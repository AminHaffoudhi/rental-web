import { api, unwrap } from "@/services/api";
import * as authService from "@/services/auth.service";
import { submitKyc, type KycDocumentType } from "@/services/kyc.service";
import type { Equipment } from "@/types/equipment";
import type { Review } from "@/types/review";
import type { User } from "@/types/user";

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  image?: string;
}

export async function updateProfile(data: UpdateProfileData): Promise<User> {
  const res = await api.put(`/users/me`, data);
  return unwrap(res);
}

export async function registerOneSignalPlayerId(playerId: string): Promise<void> {
  await api.post(`/users/me/onesignal-id`, { playerId });
}

export async function refreshProfile(): Promise<User> {
  return authService.getMe();
}

export async function uploadKycDocument(
  documentUrl: string,
  documentType: KycDocumentType = "national_id"
): Promise<User> {
  await submitKyc({ documentUrl, documentType });
  return refreshProfile();
}

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: User["role"];
  createdAt: string;
  equipment: Equipment[];
  reviewsReceived: Review[];
}

export async function getPublicProfile(userId: string): Promise<PublicUserProfile> {
  const res = await api.get(`/users/${userId}`);
  return unwrap(res);
}
