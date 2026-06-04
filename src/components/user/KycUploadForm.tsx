import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

export function KycUploadForm() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [docType, setDocType] = useState<KycDocumentType>("national_id");
  const [docUrls, setDocUrls] = useState<string[]>([]);
  const [docKeys, setDocKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [kyc, setKyc] = useState<Awaited<ReturnType<typeof kycService.getKycStatus>> | null>(null);

  function hoursAgoLabel(iso: string): string {
    const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
    if (h <= 0) return t("kyc.justNow");
    if (h === 1) return t("kyc.oneHourAgo");
    return t("kyc.hoursAgo", { count: h });
  }

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
    return <p className="text-sm text-stone-600">{t("kyc.renterOnly")}</p>;
  }

  if (loading || kyc === null) {
    return <p className="text-sm text-stone-500">{t("kyc.loadingStatus")}</p>;
  }

  const status = kyc.kycStatus ?? user.kycStatus;
  const doc = kyc.document;
  const previewUrl = docUrls[0] ?? "";
  const previewKey = docKeys[0] ?? "";
  const previewIsPdf =
    previewKey.toLowerCase().endsWith(".pdf") || previewUrl.toLowerCase().includes(".pdf");

  async function onSubmit() {
    if (!previewUrl) {
      toast.error(t("kyc.uploadFirst"));
      return;
    }
    try {
      await userService.uploadKycDocument(previewUrl, docType);
      toast.success(t("kyc.submitted"));
      setDocUrls([]);
      setDocKeys([]);
      const me = await userService.refreshProfile();
      setUser(me);
      await refresh();
    } catch {
      toast.error(t("kyc.submitError"));
    }
  }

  if (status === "SUBMITTED" && doc) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">{t("kyc.underReview")}</p>
          <p className="mt-1 text-sm text-amber-800">
            {t("kyc.submittedAgo", { ago: hoursAgoLabel(doc.submittedAt) })}
          </p>
        </div>
        {doc.documentUrl ? (
          <a href={doc.documentUrl} target="_blank" rel="noreferrer" className="block">
            {doc.documentUrl.toLowerCase().includes(".pdf") ? (
              <p className="text-sm font-medium text-brand-600 underline">{t("kyc.viewPdf")}</p>
            ) : (
              <img
                src={doc.documentUrl}
                alt={t("kyc.submittedDocAlt")}
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
        <p className="font-semibold text-emerald-900">{t("kyc.verifiedCanList")}</p>
        {doc?.reviewedAt ? (
          <p className="mt-1 text-sm text-emerald-800">
            {t("kyc.approvedOn", {
              date: new Date(doc.reviewedAt).toLocaleDateString(),
            })}
          </p>
        ) : null}
      </div>
    );
  }

  const uploadBlock = (
    <div className="space-y-4">
      <p className="text-xs text-stone-500">{t("kyc.acceptedFormats")}</p>
      <div className="space-y-2">
        <p className="text-sm font-medium text-stone-800">{t("kyc.documentType")}</p>
        <Select value={docType} onValueChange={(v) => setDocType(v as KycDocumentType)}>
          <SelectTrigger className="input h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national_id">{t("kyc.nationalId")}</SelectItem>
            <SelectItem value="passport">{t("kyc.passport")}</SelectItem>
            <SelectItem value="driving_license">{t("kyc.drivingLicense")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ImageUploader
        folder="kyc"
        maxFiles={1}
        accept="image/*,application/pdf"
        label={t("kyc.uploadLabel")}
        hint={t("kyc.uploadHint")}
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
            {t("kyc.previewPdf")}
          </a>
        ) : (
          <img src={previewUrl} alt="" className="max-h-40 rounded-lg border object-contain" />
        )
      ) : null}
      <Button type="button" className="min-h-[44px]" disabled={!previewUrl} onClick={() => void onSubmit()}>
        {t("kyc.submitForReview")}
      </Button>
    </div>
  );

  if (status === "REJECTED" && doc?.adminNote) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-900">{t("kyc.verificationIssue")}</p>
          <p className="mt-2 text-sm text-red-800">
            <span className="font-medium">{t("kyc.reason")}</span> {doc.adminNote}
          </p>
        </div>
        <div className="space-y-4 rounded-xl border border-stone-200 p-4">{uploadBlock}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 p-6">
      <div>
        <p className="font-display text-lg font-semibold text-stone-900">{t("kyc.title")}</p>
        <p className="mt-2 text-sm text-stone-600">{t("kyc.body")}</p>
      </div>
      {uploadBlock}
      {kyc.canList === false ? (
        <p className="text-xs text-stone-500">
          {t("kyc.listingDisabled", { status })}
        </p>
      ) : null}
    </div>
  );
}
