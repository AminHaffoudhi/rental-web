import { api, unwrap } from "@/services/api";

export type KycDocumentType = "national_id" | "passport" | "driving_license";

export interface KycStatusResponse {
  document: {
    id: string;
    userId: string;
    documentUrl: string;
    documentType: string | null;
    status: string;
    adminNote: string | null;
    reviewedAt: string | null;
    submittedAt: string;
  } | null;
  kycStatus?: string;
  canList?: boolean;
  role?: string;
}

export async function submitKyc(body: {
  documentUrl: string;
  documentType: KycDocumentType;
}): Promise<void> {
  const res = await api.post(`/kyc/submit`, body);
  unwrap(res);
}

export async function getKycStatus(): Promise<KycStatusResponse> {
  const res = await api.get(`/kyc/status`);
  return unwrap(res);
}
