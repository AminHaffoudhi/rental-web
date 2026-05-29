export type Role = "RENTER" | "OWNER" | "BOTH" | "ADMIN";
export type KycStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface KycDocumentBrief {
  id: string;
  documentUrl: string;
  documentType: string | null;
  status: KycStatus | string;
  adminNote: string | null;
  reviewedAt: string | null;
  submittedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  coverImage?: string | null;
  bio?: string;
  location?: string | null;
  role: Role;
  kycStatus: KycStatus;
  phone?: string;
  emailVerified?: boolean;
  canList?: boolean;
  kycDocument?: KycDocumentBrief | null;
  createdAt: string;
}
