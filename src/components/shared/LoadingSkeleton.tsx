interface LoadingSkeletonProps {
  count?: number;
  /** @deprecated Equipment grid uses `EquipmentCardSkeleton` instead */
  height?: string;
}

/** Generic stacked bars — useful for bookings/lists. */
export function LoadingSkeleton({ count = 4 }: LoadingSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-stone-100 bg-white p-4 shadow-sm"
        >
          <div className="skeleton mb-3 h-5 w-2/3 max-w-xs" />
          <div className="skeleton mb-2 h-4 w-full max-w-md" />
          <div className="skeleton h-4 w-1/2 max-w-sm" />
        </div>
      ))}
    </div>
  );
}
