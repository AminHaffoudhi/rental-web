import { motion } from "framer-motion";
import { ArrowLeft, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EquipmentForm } from "@/components/equipment/EquipmentForm";
import { getApiErrorDetail } from "@/services/api";
import * as equipmentService from "@/services/equipment.service";

export function NewListing() {
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
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to My Listings
        </Link>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 shadow-warm">
            <Package className="h-6 w-6 text-white" aria-hidden />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-900">List your equipment</h1>
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-stone-500">
              Add photos, set your rates, and publish when you&apos;re ready. Renters will find your
              listing in search.
            </p>
          </div>
        </div>
      </motion.div>

      <EquipmentForm
        submitLabel="Publish listing"
        onSubmit={async (data) => {
          try {
            await equipmentService.createEquipment(data);
            toast.success("Listing created");
            navigate("/dashboard/listings");
          } catch (e) {
            toast.error(getApiErrorDetail(e).message);
          }
        }}
      />
    </div>
  );
}
