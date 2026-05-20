import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EquipmentCardSkeleton } from "@/components/equipment/EquipmentCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Equipment } from "@/types/equipment";
import { cn } from "@/utils/cn";

interface EquipmentGridProps {
  equipment: Equipment[];
  isLoading: boolean;
  columns?: 2 | 3 | 4;
}

const gridCols = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function EquipmentGrid({
  equipment,
  isLoading,
  columns = 3,
}: EquipmentGridProps) {
  const colClass = gridCols[columns];

  if (isLoading) {
    return (
      <div className={cn("grid gap-6", colClass)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <EquipmentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!equipment.length) {
    return (
      <EmptyState
        icon={SearchX}
        title="No equipment found"
        subtitle="Try adjusting your filters"
      />
    );
  }

  return (
    <motion.div
      className={cn("grid gap-6", colClass)}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {equipment.map((item) => (
        <motion.div key={item.id} variants={cardVariants}>
          <EquipmentCard equipment={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
