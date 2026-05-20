import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/shared/ImageUploader";
import * as kycService from "@/services/kyc.service";
import type { KycDocumentType } from "@/services/kyc.service";
import * as userService from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

function hoursAgo(iso: string): string {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (h <= 0) return "just now";
  if (h === 1) return "1 hour ago";
  return `${h} hours ago`;
}

export function KycUploadForm() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [docType, setDocType] = useState<KycDocumentType>("national_id");
  const [docUrls, setDocUrls] = useState<string[]>([]);
  const [docKeys, setDocKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [kyc, setKyc] = useState<Awaited<ReturnType<typeof kycService.getKycStatus>> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await kycService.getKycStatus();
      setKyc(data);
    } catch {
      setKyc(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role === "RENTER") {
      queueMicrotask(() => {
        setLoading(false);
        setKyc(null);
      });
      return;
    }
    queueMicrotask(() => {
      void refresh();
    });
  }, [user, refresh]);

  if (!user || user.role === "RENTER") {
    return (
      <p className="text-sm text-stone-600">
        Identity verification is only required if you list equipment as an owner.
      </p>
    );
  }

  if (loading || kyc === null) {
    return <p className="text-sm text-stone-500">Loading verification status…</p>;
  }

  const status = kyc.kycStatus ?? user.kycStatus;
  const doc = kyc.document;
  const previewUrl = docUrls[0] ?? "";
  const previewKey = docKeys[0] ?? "";
  const previewIsPdf =
    previewKey.toLowerCase().endsWith(".pdf") || previewUrl.toLowerCase().includes(".pdf");

  async function onSubmit() {
    if (!previewUrl) {
      toast.error("Upload a document first");
      return;
    }
    try {
      await userService.uploadKycDocument(previewUrl, docType);
      toast.success("Submitted for review");
      setDocUrls([]);
      setDocKeys([]);
      const me = await userService.refreshProfile();
      setUser(me);
      await refresh();
    } catch {
      toast.error("Could not submit");
    }
  }

  if (status === "SUBMITTED" && doc) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">Under review</p>
          <p className="mt-1 text-sm text-amber-800">
            Submitted {hoursAgo(doc.submittedAt)}. You will be notified within 24–48 hours.
          </p>
        </div>
        {doc.documentUrl ? (
          <a href={doc.documentUrl} target="_blank" rel="noreferrer" className="block">
            {doc.documentUrl.toLowerCase().includes(".pdf") ? (
              <p className="text-sm font-medium text-brand-600 underline">View submitted PDF</p>
            ) : (
              <img
                src={doc.documentUrl}
                alt="Submitted document"
                className="max-h-48 rounded-xl border object-contain"
              />
            )}
          </a>
        ) : null}
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-900">Verified — you can list equipment</p>
        {doc?.reviewedAt ? (
          <p className="mt-1 text-sm text-emerald-800">
            Approved on {new Date(doc.reviewedAt).toLocaleDateString()}
          </p>
        ) : null}
      </div>
    );
  }

  const uploadBlock = (
    <div className="space-y-4">
      <p className="text-xs text-stone-500">
        Accepted: JPG, PNG, WebP, PDF · up to 20MB. Must show full name and photo clearly (for ID
        cards).
      </p>
      <div className="space-y-2">
        <p className="text-sm font-medium text-stone-800">Document type</p>
        <Select value={docType} onValueChange={(v) => setDocType(v as KycDocumentType)}>
          <SelectTrigger className="input h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national_id">National ID</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="driving_license">Driving license</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ImageUploader
        folder="kyc"
        maxFiles={1}
        accept="image/*,application/pdf"
        label="Upload identity document"
        hint="National ID, passport, or driving license"
        valueUrls={docUrls}
        valueKeys={docKeys}
        onChange={(urls, keys) => {
          setDocUrls(urls);
          setDocKeys(keys);
        }}
      />
      {previewUrl ? (
        previewIsPdf ? (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm font-medium text-brand-600 underline"
          >
            Preview PDF
          </a>
        ) : (
          <img src={previewUrl} alt="" className="max-h-40 rounded-lg border object-contain" />
        )
      ) : null}
      <Button type="button" className="min-h-[44px]" disabled={!previewUrl} onClick={() => void onSubmit()}>
        Submit for review
      </Button>
    </div>
  );

  if (status === "REJECTED" && doc?.adminNote) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-900">Verification issue</p>
          <p className="mt-2 text-sm text-red-800">
            <span className="font-medium">Reason:</span> {doc.adminNote}
          </p>
        </div>
        <div className="space-y-4 rounded-xl border border-stone-200 p-4">{uploadBlock}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 p-6">
      <div>
        <p className="font-display text-lg font-semibold text-stone-900">Identity verification</p>
        <p className="mt-2 text-sm text-stone-600">
          Owners must verify their identity before listing equipment. Upload a clear photo or PDF of
          your government-issued ID.
        </p>
      </div>
      {uploadBlock}
      {kyc.canList === false && user.role !== "RENTER" ? (
        <p className="text-xs text-stone-500">
          Listing is disabled until an admin approves your document ({status}).
        </p>
      ) : null}
    </div>
  );
}
