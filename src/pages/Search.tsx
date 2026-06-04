import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  Search as SearchIcon,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { CategoryFilter } from "@/components/equipment/CategoryFilter";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolveCategorySlug } from "@/config/categories";
import { useCategories } from "@/hooks/useCategories";
import { useEquipmentList } from "@/hooks/useEquipment";
import { useDebounce } from "@/hooks/useDebounce";
import type { EquipmentSort } from "@/services/equipment.service";
import { cn } from "@/utils/cn";

const PAGE_SIZE = 12;

function parseSort(raw: string | null): EquipmentSort {
  if (raw === "price_asc" || raw === "price_desc" || raw === "rating") return raw;
  return "recent";
}

function visiblePages(current: number, total: number): number[] {
  if (total <= 1) return [1];
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  start = Math.max(1, end - 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Search() {
  const { t } = useTranslation();
  const { categories } = useCategories();

  const sortOptions: { value: EquipmentSort; label: string }[] = useMemo(
    () => [
      { value: "recent", label: t("search.sortRecent") },
      { value: "price_asc", label: t("search.sortPriceAsc") },
      { value: "price_desc", label: t("search.sortPriceDesc") },
      { value: "rating", label: t("search.sortRating") },
    ],
    [t]
  );
  const [params, setParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(() => {
    const q = params.get("q")?.trim() || undefined;
    const category = resolveCategorySlug(categories, params.get("category"));
    const minRaw = params.get("minPrice");
    const maxRaw = params.get("maxPrice");
    const minPrice =
      minRaw !== null && minRaw !== "" && !Number.isNaN(Number(minRaw))
        ? Number(minRaw)
        : undefined;
    const maxPrice =
      maxRaw !== null && maxRaw !== "" && !Number.isNaN(Number(maxRaw))
        ? Number(maxRaw)
        : undefined;
    const location = params.get("location")?.trim() || undefined;
    const sort = parseSort(params.get("sort"));
    const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
    const availableOnly =
      params.get("availableOnly") === "false" ? false : undefined;

    return {
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
      ...(minPrice !== undefined ? { minPrice } : {}),
      ...(maxPrice !== undefined ? { maxPrice } : {}),
      ...(location ? { location } : {}),
      ...(sort !== "recent" ? { sort } : {}),
      page,
      pageSize: PAGE_SIZE,
      ...(availableOnly === false ? { availableOnly: false } : {}),
    };
  }, [params, categories]);

  const { equipment, total, isLoading } = useEquipmentList(filters);

  const patchParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(updates)) {
            if (v === undefined || v === "") next.delete(k);
            else next.set(k, v);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const qFromUrl = params.get("q") ?? "";
  const [qInput, setQInput] = useState(qFromUrl);
  const debouncedQ = useDebounce(qInput, 300);

  useEffect(() => {
    setQInput(qFromUrl);
  }, [qFromUrl]);

  useEffect(() => {
    const current = params.get("q") ?? "";
    if (debouncedQ.trim() === current.trim()) return;
    patchParams({
      q: debouncedQ.trim() || undefined,
      page: "1",
    });
  }, [debouncedQ, patchParams, params]);

  const selectedCategory = resolveCategorySlug(categories, params.get("category"));

  const sortValue = parseSort(params.get("sort"));
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const [draftMin, setDraftMin] = useState("");
  const [draftMax, setDraftMax] = useState("");
  const [draftLoc, setDraftLoc] = useState("");
  const [draftAvailOnly, setDraftAvailOnly] = useState(true);

  useEffect(() => {
    setDraftMin(params.get("minPrice") ?? "");
    setDraftMax(params.get("maxPrice") ?? "");
    setDraftLoc(params.get("location") ?? "");
    setDraftAvailOnly(params.get("availableOnly") !== "false");
  }, [params]);

  const applySidebar = useCallback(() => {
    patchParams({
      minPrice: draftMin.trim() || undefined,
      maxPrice: draftMax.trim() || undefined,
      location: draftLoc.trim() || undefined,
      availableOnly: draftAvailOnly ? undefined : "false",
      page: "1",
    });
    setMobileFiltersOpen(false);
  }, [draftMin, draftMax, draftLoc, draftAvailOnly, patchParams]);

  const resetSidebar = useCallback(() => {
    setDraftMin("");
    setDraftMax("");
    setDraftLoc("");
    setDraftAvailOnly(true);
    patchParams({
      minPrice: undefined,
      maxPrice: undefined,
      location: undefined,
      availableOnly: undefined,
      page: "1",
    });
    setMobileFiltersOpen(false);
  }, [patchParams]);

  const presetPrice = useCallback((min: string, max: string) => {
    setDraftMin(min);
    setDraftMax(max);
  }, []);

  const qDisplay = params.get("q")?.trim();

  return (
    <div className="min-h-screen bg-canvas">
      {/* SearchHero */}
      <div className="border-b border-stone-200 bg-canvas-card shadow-sm">
        <div className="container py-6">
          <div className="relative mb-5">
            <SearchIcon
              className="pointer-events-none absolute start-4 top-1/2 z-[1] h-5 w-5 -translate-y-1/2 text-stone-400"
              aria-hidden
            />
            <input
              type="search"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  patchParams({
                    q: qInput.trim() || undefined,
                    page: "1",
                  });
                }
              }}
              placeholder={t("nav.searchEquipmentPlaceholder")}
              className="input input-lg w-full rounded-full border-stone-200 py-3 ps-12 pe-4 shadow-sm transition-all focus:border-brand-500 focus:shadow-elevated"
              aria-label={t("search.searchListingsLabel")}
            />
          </div>
          <CategoryFilter
            selected={selectedCategory}
            onSelect={(c) =>
              patchParams({
                category: c ?? undefined,
                page: "1",
              })
            }
          />
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col gap-8 py-8 sm:py-10 lg:flex-row">
          {/* Desktop sidebar */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-[88px] rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm">
              <FilterFields
                draftMin={draftMin}
                setDraftMin={setDraftMin}
                draftMax={draftMax}
                setDraftMax={setDraftMax}
                draftLoc={draftLoc}
                setDraftLoc={setDraftLoc}
                draftAvailOnly={draftAvailOnly}
                setDraftAvailOnly={setDraftAvailOnly}
                presetPrice={presetPrice}
              />
              <div className="mt-6 flex flex-col gap-2">
                <button type="button" className="btn btn-primary w-full" onClick={applySidebar}>
                  {t("search.applyFilters")}
                </button>
                <button type="button" className="btn btn-ghost w-full text-stone-500" onClick={resetSidebar}>
                  {t("search.reset")}
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-500">
                {qDisplay ? (
                  <>
                    {t("search.resultsForQuery")}{" "}
                    <strong className="text-stone-800">&apos;{qDisplay}&apos;</strong>
                  </>
                ) : (
                  <span className="font-medium text-stone-700">
                    {t("search.listingsFound", { count: total })}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("search.filters")}
                </button>
                <Select
                  value={sortValue}
                  onValueChange={(v) =>
                    patchParams({
                      sort: v === "recent" ? undefined : v,
                      page: "1",
                    })
                  }
                >
                  <SelectTrigger className="input h-10 w-full min-w-[200px] rounded-xl border-stone-200 bg-canvas-card sm:w-[220px]">
                    <SelectValue placeholder={t("search.sortLabel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <EquipmentGrid equipment={equipment} isLoading={isLoading} columns={3} />

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-col items-center gap-4">
                <p className="text-sm text-stone-500">
                  {t("search.pageOf", { current: page, total: totalPages })}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={page <= 1}
                    onClick={() => patchParams({ page: String(Math.max(1, page - 1)) })}
                  >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                    {t("search.previous")}
                  </button>
                  <div className="flex flex-wrap justify-center gap-1">
                    {visiblePages(page, totalPages).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={cn(
                          "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
                          p === page
                            ? "bg-brand-500 text-white"
                            : "bg-canvas-card text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
                        )}
                        onClick={() => patchParams({ page: String(p) })}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={page >= totalPages}
                    onClick={() =>
                      patchParams({ page: String(Math.min(totalPages, page + 1)) })
                    }
                  >
                    {t("search.next")}
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 380 }}
              className="absolute bottom-0 start-0 end-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-canvas-card px-4 pb-8 pt-2 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-200" aria-hidden />
              <p className="mb-4 font-display text-lg font-semibold text-stone-900">{t("search.filters")}</p>
              <FilterFields
                draftMin={draftMin}
                setDraftMin={setDraftMin}
                draftMax={draftMax}
                setDraftMax={setDraftMax}
                draftLoc={draftLoc}
                setDraftLoc={setDraftLoc}
                draftAvailOnly={draftAvailOnly}
                setDraftAvailOnly={setDraftAvailOnly}
                presetPrice={presetPrice}
              />
              <button type="button" className="btn btn-primary mt-6 w-full" onClick={applySidebar}>
                {t("search.applyFilters")}
              </button>
              <button
                type="button"
                className="btn btn-ghost mt-2 w-full text-stone-500"
                onClick={resetSidebar}
              >
                {t("search.reset")}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FilterFields({
  draftMin,
  setDraftMin,
  draftMax,
  setDraftMax,
  draftLoc,
  setDraftLoc,
  draftAvailOnly,
  setDraftAvailOnly,
  presetPrice,
}: {
  draftMin: string;
  setDraftMin: (v: string) => void;
  draftMax: string;
  setDraftMax: (v: string) => void;
  draftLoc: string;
  setDraftLoc: (v: string) => void;
  draftAvailOnly: boolean;
  setDraftAvailOnly: (v: boolean) => void;
  presetPrice: (min: string, max: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-display text-sm font-semibold text-stone-900">{t("search.dailyRate")}</p>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={t("search.minRatePlaceholder")}
            value={draftMin}
            onChange={(e) => setDraftMin(e.target.value)}
            className="input min-w-0 flex-1"
            aria-label={t("search.minRate")}
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder={t("search.maxRatePlaceholder")}
            value={draftMax}
            onChange={(e) => setDraftMax(e.target.value)}
            className="input min-w-0 flex-1"
            aria-label={t("search.maxRate")}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-brand-200 hover:bg-brand-50 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-brand-500/15"
            onClick={() => presetPrice("", "50")}
          >
            {t("search.priceUnder50")}
          </button>
          <button
            type="button"
            className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-brand-200 hover:bg-brand-50 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-brand-500/15"
            onClick={() => presetPrice("50", "150")}
          >
            {t("search.price50to150")}
          </button>
          <button
            type="button"
            className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-brand-200 hover:bg-brand-50 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-brand-500/15"
            onClick={() => presetPrice("150", "")}
          >
            {t("search.priceOver150")}
          </button>
        </div>
      </div>

      <div>
        <p className="mb-3 font-display text-sm font-semibold text-stone-900">{t("search.location")}</p>
        <div className="relative">
          <MapPin className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={t("search.locationPlaceholder")}
            value={draftLoc}
            onChange={(e) => setDraftLoc(e.target.value)}
            className="input ps-10"
            aria-label={t("search.location")}
          />
        </div>
      </div>

      <div>
        <p className="mb-3 font-display text-sm font-semibold text-stone-900">{t("search.availableNow")}</p>
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span className="text-sm text-stone-600">{t("search.availableOnlyHint")}</span>
          <button
            type="button"
            role="switch"
            aria-checked={draftAvailOnly}
            onClick={() => setDraftAvailOnly(!draftAvailOnly)}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
              draftAvailOnly ? "bg-brand-500" : "bg-stone-200"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200",
                draftAvailOnly ? "translate-x-[26px] rtl:-translate-x-[26px]" : "translate-x-0.5 rtl:-translate-x-0.5"
              )}
            />
          </button>
        </label>
      </div>
    </div>
  );
}
