import { cn } from "@/utils/cn";

export function EquipmentCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm",
        className
      )}
    >
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-4 w-[70%]" />
        <div className="skeleton h-3 w-[45%]" />
        <div className="flex justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="skeleton h-6 w-6 shrink-0 rounded-full" />
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="my-3 h-px bg-stone-100" />
        <div className="flex justify-between">
          <div className="skeleton h-5 w-[30%]" />
          <div className="skeleton h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
