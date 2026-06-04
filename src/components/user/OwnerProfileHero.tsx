import { format, parseISO } from "date-fns";
import { ar, enUS, fr } from "date-fns/locale";
import {
  BadgeCheck,
  Calendar,
  ExternalLink,
  MapPin,
  Package,
  Pencil,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { coverGradient } from "@/components/shared/CoverUploader";
import { UserAvatar } from "@/components/user/UserAvatar";
import { RatingStars } from "@/components/user/RatingStars";
import type { PublicUserProfile } from "@/services/user.service";
import { useLocaleStore } from "@/store/localeStore";
import { cn } from "@/utils/cn";

interface OwnerProfileHeroProps {
  profile: PublicUserProfile;
  isOwnProfile?: boolean;
}

const dateLocales = { en: enUS, fr, ar } as const;

const statAccent = {
  listings:
    "bg-brand-50 text-brand-600 ring-brand-100 dark:bg-brand-500/20 dark:text-brand-400 dark:ring-brand-500/30",
  reviews:
    "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/30",
  rating:
    "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-500/30",
  since:
    "bg-stone-100 text-stone-600 ring-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-600",
} as const;

export function OwnerProfileHero({ profile, isOwnProfile }: OwnerProfileHeroProps) {
  const { t } = useTranslation();
  const language = useLocaleStore((s) => s.language);
  const locale = dateLocales[language] ?? enUS;
  const memberSince = format(parseISO(profile.createdAt), "MMMM yyyy", { locale });
  const { stats } = profile;

  const roleKey =
    profile.role === "OWNER"
      ? "profile.equipmentOwner"
      : profile.role === "BOTH"
        ? "profile.roleBoth"
        : profile.role === "ADMIN"
          ? "profile.roleAdmin"
          : "profile.roleRenter";

  const statCards = [
    { key: "listings" as const, label: t("profile.statListings"), value: String(stats.listings), icon: Package },
    { key: "reviews" as const, label: t("profile.statReviews"), value: String(stats.reviews), icon: Star },
    {
      key: "rating" as const,
      label: t("profile.statRating"),
      value: stats.avgRating !== null ? stats.avgRating.toFixed(1) : "—",
      icon: Star,
    },
    {
      key: "since" as const,
      label: t("profile.statOnPlatform"),
      value: memberSince,
      icon: Calendar,
      small: true,
    },
  ];

  return (
    <section className="relative overflow-visible">
      <div
        className="relative h-40 w-full overflow-hidden sm:h-52 md:h-60 lg:h-72"
        style={!profile.coverImage ? { background: coverGradient(profile.name) } : undefined}
      >
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="" className="h-full w-full object-cover" />
        ) : null}
        <div
          className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-950/25 to-stone-950/85"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(0,0,0,0.55)_0%,transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="container relative z-10 -mt-16 px-4 sm:-mt-20 sm:px-6 md:-mt-24 lg:-mt-28">
        <div
          className={cn(
            "relative overflow-visible rounded-3xl border border-stone-200/90 bg-canvas-card",
            "shadow-[0_20px_50px_-12px_rgba(28,25,23,0.18)] ring-1 ring-stone-900/5",
            "dark:border-stone-700 dark:bg-stone-900 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] dark:ring-white/10"
          )}
        >
          <div className="overflow-hidden rounded-t-3xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-400 to-amber-400" aria-hidden />
          </div>

          {/* Avatar overlaps cover — parent must stay overflow-visible */}
          <div className="relative px-4 pt-2 sm:px-6 sm:pt-3 md:px-8">
            <div className="flex justify-center sm:absolute sm:start-6 sm:top-0 sm:z-20 sm:-translate-y-1/2 md:start-8">
              <div
                className={cn(
                  "rounded-2xl bg-canvas-card p-1 shadow-lg ring-4 ring-canvas-card",
                  "dark:bg-stone-900 dark:ring-stone-900"
                )}
              >
                <UserAvatar
                  user={{ name: profile.name, image: profile.image ?? undefined }}
                  size="lg"
                  className="h-24 w-24 text-2xl sm:h-28 sm:w-28 md:h-32 md:w-32"
                />
              </div>
            </div>

            <div
              className={cn(
                "flex flex-col gap-6 pt-4 sm:pt-6",
                "sm:ps-[7.25rem] md:ps-[8.75rem] lg:ps-[9.5rem]"
              )}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 text-center sm:text-start">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h1 className="font-display text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-2xl md:text-3xl">
                      {profile.name}
                    </h1>
                    {profile.kycStatus === "APPROVED" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm dark:bg-emerald-600">
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                        {t("profile.verified")}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
                    {t(roleKey)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-stone-500 dark:text-stone-400 sm:justify-start">
                    {profile.location ? (
                      <span className="inline-flex max-w-full items-center gap-1.5">
                        <MapPin className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500" aria-hidden />
                        <span className="truncate">{profile.location}</span>
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500" aria-hidden />
                      {t("profile.memberSince", { date: memberSince })}
                    </span>
                  </div>

                  {stats.avgRating !== null ? (
                    <div
                      className={cn(
                        "mt-4 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full px-3 py-2",
                        "bg-stone-50 ring-1 ring-stone-200/80",
                        "dark:bg-stone-800 dark:ring-stone-600 sm:justify-start"
                      )}
                    >
                      <RatingStars rating={Math.round(stats.avgRating)} size="sm" />
                      <span className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-100">
                        {stats.avgRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-stone-500 dark:text-stone-400">
                        {stats.reviews === 1
                          ? t("profile.oneReview")
                          : t("profile.reviewsCount", { count: stats.reviews })}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                      {t("profile.noReviewsYet")}
                    </p>
                  )}
                </div>

                {isOwnProfile ? (
                  <Link
                    to="/profile"
                    className="btn btn-secondary mx-auto inline-flex w-full max-w-xs shrink-0 items-center justify-center gap-2 shadow-sm sm:mx-0 sm:w-auto sm:max-w-none lg:self-start"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                    {t("profile.editProfile")}
                  </Link>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
                {statCards.map((stat) => (
                  <div
                    key={stat.key}
                    className={cn(
                      "rounded-2xl border p-3 transition-shadow sm:p-4",
                      "border-stone-200/80 bg-stone-50/80 hover:shadow-md",
                      "dark:border-stone-700 dark:bg-stone-800/80 dark:hover:shadow-lg dark:hover:shadow-black/20"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-9 sm:w-9",
                          statAccent[stat.key]
                        )}
                      >
                        <stat.icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0 text-[10px] font-bold uppercase leading-tight tracking-wide text-stone-500 dark:text-stone-400 sm:text-[11px]">
                        {stat.label}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-1.5 font-display font-semibold text-stone-900 dark:text-stone-50 sm:mt-2",
                        stat.small ? "text-xs sm:text-sm" : "text-xl tabular-nums sm:text-2xl"
                      )}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-4 sm:h-5 md:h-6" aria-hidden />
        </div>
      </div>
    </section>
  );
}

export function OwnerProfileShareHint({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/users/${userId}`
      : `/users/${userId}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
    >
      {t("profile.openPublicPage")}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  );
}
