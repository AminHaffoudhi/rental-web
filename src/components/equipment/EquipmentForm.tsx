import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Camera,
  Coins,
  FileText,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import { z } from "zod";
import { ImageUploader } from "@/components/shared/ImageUploader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CategoryIcon } from "@/components/equipment/CategoryIcon";
import { useCategories } from "@/hooks/useCategories";
import type { CreateEquipmentData } from "@/services/equipment.service";
import { cn } from "@/utils/cn";

const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 2000;
const TITLE_MAX = 120;
const MAX_RUN_WITHOUT_SPACE = 80;

function hasAbsurdRun(value: string): boolean {
  return new RegExp(`[^\\s]{${MAX_RUN_WITHOUT_SPACE},}`).test(value);
}

function toOptionalNumber(val: unknown): number | undefined {
  if (val === "" || val === undefined || val === null) return undefined;
  const n = Number(val);
  return Number.isNaN(n) ? undefined : n;
}

function toRequiredNumber(val: unknown): unknown {
  if (val === "" || val === undefined || val === null) return undefined;
  const n = Number(val);
  return Number.isNaN(n) ? val : n;
}

const schema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(TITLE_MAX, `Title cannot exceed ${TITLE_MAX} characters`)
      .refine((v) => !hasAbsurdRun(v), "Title has an unbroken string that's too long — add spaces"),
    description: z
      .string()
      .trim()
      .min(DESCRIPTION_MIN, `Description must be at least ${DESCRIPTION_MIN} characters`)
      .max(DESCRIPTION_MAX, `Description cannot exceed ${DESCRIPTION_MAX} characters`)
      .refine(
        (v) => !hasAbsurdRun(v),
        "Description has an unbroken string that's too long — add spaces or line breaks"
      ),
    categoryId: z.string().min(1, "Choose a category"),
    dailyRate: z.preprocess(
      toRequiredNumber,
      z
        .number({ message: "Daily rate is required" })
        .positive("Daily rate must be greater than 0")
        .max(100_000, "Daily rate seems too high")
    ),
    weeklyRate: z.preprocess(
      toOptionalNumber,
      z
        .number()
        .positive("Weekly rate must be greater than 0")
        .max(500_000, "Weekly rate seems too high")
        .optional()
    ),
    depositAmount: z.preprocess(
      (val) => toOptionalNumber(val) ?? 0,
      z
        .number()
        .nonnegative("Deposit cannot be negative")
        .max(100_000, "Deposit seems too high")
    ),
    deliveryFee: z.preprocess(
      (val) => toOptionalNumber(val) ?? 0,
      z
        .number()
        .nonnegative("Delivery fee cannot be negative")
        .max(10_000, "Delivery fee seems too high")
    ),
    location: z
      .string()
      .trim()
      .min(2, "Location is required (city or area)")
      .max(100, "Location is too long"),
    images: z.array(z.string()).min(1, "Add at least one photo of your equipment"),
    imageKeys: z.array(z.string()).optional(),
  })
  .refine(
    (data) => !data.weeklyRate || data.weeklyRate >= data.dailyRate,
    {
      message: "Weekly rate should be at least the daily rate",
      path: ["weeklyRate"],
    }
  )
  .refine(
    (data) => !data.weeklyRate || data.weeklyRate <= data.dailyRate * 7,
    {
      message: "Weekly rate should not exceed 7× the daily rate",
      path: ["weeklyRate"],
    }
  );

type FormValues = z.infer<typeof schema>;

interface EquipmentFormProps {
  defaultValues?: Partial<CreateEquipmentData>;
  onSubmit: (data: CreateEquipmentData) => Promise<void> | void;
  submitLabel?: string;
}

function FormSection({
  title,
  description,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm sm:p-7"
    >
      <motion.div className="mb-6 flex items-start gap-3">
        <motion.div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <Icon className="h-5 w-5 text-brand-600" aria-hidden />
        </motion.div>
        <div>
          <h2 className="font-display text-lg font-semibold text-stone-900">{title}</h2>
          <p className="mt-0.5 text-sm text-stone-500">{description}</p>
        </div>
      </motion.div>
      <div className="space-y-5">{children}</div>
    </motion.section>
  );
}

function NumberField({
  value,
  onChange,
  onBlur,
  name,
  placeholder,
  min = 0,
  step = "0.01",
  className,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onBlur: () => void;
  name: string;
  placeholder?: string;
  min?: number;
  step?: string;
  className?: string;
}) {
  return (
    <input
      type="number"
      name={name}
      min={min}
      step={step}
      placeholder={placeholder}
      className={cn("input", className)}
      value={value === undefined || Number.isNaN(value) ? "" : value}
      onBlur={onBlur}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? undefined : Number(raw));
      }}
    />
  );
}

export function EquipmentForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: EquipmentFormProps) {
  const { t } = useTranslation();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const resolvedSubmitLabel = submitLabel ?? t("listing.saveListing");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    mode: "onTouched",
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      categoryId: defaultValues?.categoryId ?? undefined,
      dailyRate: defaultValues?.dailyRate,
      weeklyRate: defaultValues?.weeklyRate,
      depositAmount: defaultValues?.depositAmount ?? 0,
      deliveryFee: defaultValues?.deliveryFee ?? 0,
      location: defaultValues?.location ?? "",
      images: defaultValues?.images ?? [],
      imageKeys: defaultValues?.imageKeys ?? [],
    },
  });

  const { isSubmitting } = form.formState;
  const description = form.watch("description") ?? "";
  const imageCount = (form.watch("images") ?? []).length;

  async function handleSubmit(values: FormValues) {
    const payload: CreateEquipmentData = {
      title: values.title.trim(),
      description: values.description.trim(),
      categoryId: values.categoryId,
      dailyRate: values.dailyRate,
      weeklyRate: values.weeklyRate,
      depositAmount: values.depositAmount ?? 0,
      deliveryFee: values.deliveryFee ?? 0,
      location: values.location.trim(),
      images: values.images ?? [],
      imageKeys: values.imageKeys ?? [],
    };
    await onSubmit(payload);
  }

  function onInvalid(fieldErrors: FieldErrors<FormValues>) {
    const firstKey = Object.keys(fieldErrors)[0] as keyof FormValues | undefined;
    if (!firstKey) return;
    const el =
      document.querySelector(`[name="${firstKey}"]`) ??
      document.querySelector(`[data-field="${firstKey}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
        className="space-y-6"
        noValidate
      >
        <FormSection
          title={t("listing.sectionBasics")}
          description={t("listing.sectionBasicsDesc")}
          icon={FileText}
          delay={0}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("listing.titleLabel")}</FormLabel>
                <FormControl>
                  <input
                    className="input"
                    placeholder={t("listing.titlePlaceholder")}
                    maxLength={TITLE_MAX}
                    data-field="title"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-stone-400">
                  {t("listing.charactersCount", { current: field.value.length, max: TITLE_MAX })}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("listing.descriptionLabel")}</FormLabel>
                <FormControl>
                  <textarea
                    rows={5}
                    className="input min-h-[120px] resize-y py-3"
                    placeholder={t("listing.descriptionPlaceholder")}
                    maxLength={DESCRIPTION_MAX}
                    data-field="description"
                    {...field}
                  />
                </FormControl>
                <FormDescription
                  className={cn(
                    "text-stone-400",
                    description.length > 0 && description.length < DESCRIPTION_MIN && "text-amber-600"
                  )}
                >
                  {t("listing.charactersCount", {
                    current: description.length,
                    max: DESCRIPTION_MAX,
                  })}{" "}
                  · {t("listing.descriptionMin", { min: DESCRIPTION_MIN })}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem data-field="categoryId">
                <FormLabel>{t("listing.categoryLabel")}</FormLabel>
                <FormControl>
                  {categoriesLoading && categories.length === 0 ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[72px] animate-pulse rounded-xl bg-stone-100"
                        />
                      ))}
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="text-sm text-amber-700">{t("listing.noCategories")}</p>
                  ) : (
                    <motion.div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {categories.map((c) => {
                        const selected = field.value === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => field.onChange(c.id)}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-3 text-center transition-all duration-150",
                              selected
                                ? "border-brand-500 bg-brand-50 shadow-sm"
                                : "border-stone-100 bg-stone-100/50 hover:border-stone-200 hover:bg-canvas-card"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg",
                                c.color
                              )}
                            >
                              <CategoryIcon
                                iconUrl={c.iconUrl}
                                name={c.name}
                                className="h-4 w-4"
                                imgClassName="h-4 w-4"
                              />
                            </span>
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                selected ? "text-brand-700" : "text-stone-600"
                              )}
                            >
                              {c.name}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title={t("listing.sectionPricing")}
          description={t("listing.sectionPricingDesc")}
          icon={Coins}
          delay={0.05}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="dailyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.dailyRateRequired")}</FormLabel>
                  <FormControl>
                    <NumberField
                      name="dailyRate"
                      placeholder="50"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weeklyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.weeklyRateLabel")}</FormLabel>
                  <FormControl>
                    <NumberField
                      name="weeklyRate"
                      placeholder="280"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormDescription className="text-stone-400">
                    {t("listing.weeklyDiscountHint")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="depositAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.depositLabel")}</FormLabel>
                  <FormControl>
                    <NumberField
                      name="depositAmount"
                      placeholder="0"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormDescription className="text-stone-400">
                    {t("listing.depositHeldHint")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.deliveryFeeLabel")}</FormLabel>
                  <FormControl>
                    <NumberField
                      name="deliveryFee"
                      placeholder="0"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormDescription className="text-stone-400">
                    {t("listing.deliveryChargeHint")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection
          title={t("listing.sectionLocation")}
          description={t("listing.sectionLocationDesc")}
          icon={MapPin}
          delay={0.1}
        >
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("listing.locationCityLabel")}</FormLabel>
                <FormControl>
                  <input
                    className="input"
                    placeholder={t("listing.locationPlaceholderShort")}
                    data-field="location"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title={t("listing.sectionPhotos")}
          description={t("listing.sectionPhotosDesc")}
          icon={Camera}
          delay={0.15}
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem data-field="images">
                <FormLabel className="sr-only">{t("listing.photosSrOnly")}</FormLabel>
                <FormControl>
                  <ImageUploader
                    folder="equipment"
                    maxFiles={8}
                    accept="image/*"
                    label={t("listing.uploadPhotos")}
                    hint={t("listing.photosUploadHint")}
                    valueUrls={field.value ?? []}
                    valueKeys={form.watch("imageKeys") ?? []}
                    onChange={(urls, keys) => {
                      field.onChange(urls);
                      form.setValue("imageKeys", keys, { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormDescription className="text-stone-400">
                  {t("listing.photosCount", { count: imageCount })}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <div className="border-t border-stone-200 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg flex w-full items-center justify-center gap-2 sm:w-auto sm:min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {t("listing.publishing")}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" aria-hidden />
                {resolvedSubmitLabel}
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-stone-400">{t("listing.editAnytimeHint")}</p>
        </div>
      </form>
    </Form>
  );
}
