import { motion } from "framer-motion";
import { ArrowLeft, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EquipmentForm } from "@/components/equipment/EquipmentForm";
import { getApiErrorDetail } from "@/services/api";
import * as equipmentService from "@/services/equipment.service";

export function NewListing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl pb-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/dashboard/listings"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-brand-600 rtl:flex-row-reverse"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t("listing.backToListings")}
        </Link>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 shadow-warm">
            <Package className="h-6 w-6 text-white" aria-hidden />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-900">{t("listing.newTitle")}</h1>
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-stone-500">
              {t("listing.newSubtitle")}
            </p>
          </div>
        </div>
      </motion.div>

      <EquipmentForm
        submitLabel={t("listing.saveListing")}
        onSubmit={async (values) => {
          try {
            const created = await equipmentService.createEquipment(values);
            toast.success(t("listing.created"));
            navigate(`/equipment/${created.id}/edit`);
          } catch (e) {
            toast.error(getApiErrorDetail(e).message);
            throw e;
          }
        }}
      />
    </div>
  );
}
