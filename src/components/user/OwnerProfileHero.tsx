import { format, parseISO } from "date-fns";
import {
  BadgeCheck,
  Calendar,
  ExternalLink,
  MapPin,
  Package,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { coverGradient } from "@/components/shared/CoverUploader";
import { UserAvatar } from "@/components/user/UserAvatar";
import { RatingStars } from "@/components/user/RatingStars";
import type { PublicUserProfile } from "@/services/user.service";
import { cn } from "@/utils/cn";

const roleLabel: Record<string, string> = {
  RENTER: "Renter",
  OWNER: "Equipment owner",
  BOTH: "Renter & owner",
  ADMIN: "Admin",
};

interface OwnerProfileHeroProps {
  profile: PublicUserProfile;
  isOwnProfile?: boolean;
}

export function OwnerProfileHero({ profile, isOwnProfile }: OwnerProfileHeroProps) {
  const memberSince = format(parseISO(profile.createdAt), "MMMM yyyy");
  const { stats } = profile;

  return (
    <section className="relative">
      <div
        className="relative h-44 w-full overflow-hidden sm:h-52 md:h-64"
        style={!profile.coverImage ? { background: coverGradient(profile.name) } : undefined}
      >
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/25 to-stone-900/10" />
      </div>

      <div className="container relative z-10 -mt-20 pb-6 sm:-mt-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="shrink-0 rounded-2xl bg-canvas-card p-1.5 shadow-lg ring-4 ring-canvas-card">
              <UserAvatar
                user={{ name: profile.name, image: profile.image ?? undefined }}
                size="lg"
                className="h-24 w-24 text-2xl sm:h-28 sm:w-28"
              />
            </div>
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white drop-shadow-sm sm:text-3xl md:text-4xl">
                  {profile.name}
                </h1>
                {profile.kycStatus === "APPROVED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/90 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm font-medium text-white/85">
                {roleLabel[profile.role] ?? profile.role}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
                {profile.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {profile.location}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Member since {memberSince}
                </span>
              </div>
              {stats.avgRating !== null ? (
                <div className="mt-3 flex items-center gap-2">
                  <RatingStars rating={Math.round(stats.avgRating)} size="sm" />
                  <span className="text-sm font-semibold text-white">
                    {stats.avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-white/70">
                    ({stats.reviews} {stats.reviews === 1 ? "review" : "reviews"})
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-sm text-white/70">No reviews yet</p>
              )}
            </div>
          </div>

          {isOwnProfile ? (
            <Link
              to="/profile"
              className="btn btn-secondary shrink-0 self-start bg-canvas-card/95 shadow-md sm:self-auto"
            >
              Edit profile
            </Link>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Listings",
              value: String(stats.listings),
              icon: Package,
            },
            {
              label: "Reviews",
              value: String(stats.reviews),
              icon: Star,
            },
            {
              label: "Rating",
              value: stats.avgRating !== null ? stats.avgRating.toFixed(1) : "—",
              icon: Star,
            },
            {
              label: "On platform",
              value: memberSince,
              icon: Calendar,
              small: true,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-stone-200/60 bg-canvas-card/95 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-stone-600/60"
            >
              <div className="flex items-center gap-2 text-stone-500">
                <stat.icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
              <p
                className={cn(
                  "mt-1 font-display font-semibold text-stone-900",
                  stat.small ? "text-sm" : "text-xl"
                )}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OwnerProfileShareHint({ userId }: { userId: string }) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/users/${userId}`
      : `/users/${userId}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
    >
      Open public page
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  );
}
