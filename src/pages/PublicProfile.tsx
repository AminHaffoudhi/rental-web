import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Package, Sparkles, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { OwnerProfileHero } from "@/components/user/OwnerProfileHero";
import { ReviewForm } from "@/components/review/ReviewForm";
import { ReviewCard } from "@/components/user/ReviewCard";
import { useAuthStore } from "@/store/authStore";
import * as userService from "@/services/user.service";
import type { PublicUserProfile } from "@/services/user.service";
import { PLATFORM_NAME } from "@/config/brand";
import { isOwnerRole } from "@/lib/roles";
import { cn } from "@/utils/cn";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useNotificationHighlight } from "@/hooks/useNotificationHighlight";

type ProfileTab = "listings" | "reviews" | "about";

export function PublicProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tabs: { id: ProfileTab; label: string; icon: typeof Package }[] = [
    { id: "listings", label: t("profile.tabListings"), icon: Package },
    { id: "reviews", label: t("profile.tabReviews"), icon: MessageSquare },
    { id: "about", label: t("profile.tabAbout"), icon: User },
  ];
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const currentUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<ProfileTab>("listings");

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    setError(null);
    try {
      const p = await userService.getPublicProfile(userId);
      setProfile(p);
    } catch {
      setError(t("profile.notFound"));
    }
  }, [userId, t]);

  const highlightedReviewId = useNotificationHighlight(loadProfile);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (highlight && profile?.reviewsReceived.some((r) => r.id === highlight)) {
      setTab("reviews");
    }
  }, [searchParams, profile?.reviewsReceived]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") {
        void loadProfile();
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadProfile]);

  const isOwnProfile = useMemo(
    () => Boolean(currentUser && profile && currentUser.id === profile.id),
    [currentUser, profile]
  );

  const isHostProfile = profile ? isOwnerRole(profile.role) : false;

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-stone-600">{error}</p>
        <Link to="/search" className="btn btn-primary">
          {t("bookings.browseCta")}
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-canvas">
        <div className="h-52 animate-pulse bg-stone-200" />
        <div className="container -mt-16 space-y-4 py-8">
          <div className="h-28 w-28 animate-pulse rounded-2xl bg-stone-200" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-stone-200" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-stone-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isOwnProfile && profile.role === "RENTER") {
    return <Navigate to="/profile" replace />;
  }

  if (!isHostProfile) {
    return (
      <div className="min-h-screen bg-canvas">
        <div className="border-b border-stone-200 bg-canvas-card/80 dark:border-stone-800">
          <div className="container flex items-center gap-2 py-3">
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-brand-600"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
              {t("profile.backToSearch")}
            </Link>
          </div>
        </div>
        <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <UserAvatar user={profile} size="lg" className="mb-4" />
          <h1 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
            {profile.name}
          </h1>
          <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">
            {t("profile.renterOnlyBody", { name: PLATFORM_NAME })}
          </p>
          <Link to="/search" className="btn btn-primary mt-8">
            {t("bookings.browseCta")}
          </Link>
        </div>
      </div>
    );
  }

  const bioText =
    profile.bio?.trim() ||
    t("profile.defaultBio", { name: profile.name, platform: PLATFORM_NAME });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-stone-200 bg-canvas-card/80">
        <div className="container flex items-center gap-2 py-3">
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
            {t("profile.backToSearch")}
          </Link>
        </div>
      </div>

      <OwnerProfileHero profile={profile} isOwnProfile={isOwnProfile} />

      <div className="container py-10">
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-brand-500 text-white shadow-warm"
                    : "bg-canvas-card text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
                )}
              >
                <t.icon className="h-4 w-4" aria-hidden />
                {t.label}
                {t.id === "listings" ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                      active ? "bg-white/20" : "bg-stone-100"
                    )}
                  >
                    {profile.stats.listings}
                  </span>
                ) : null}
                {t.id === "reviews" ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                      active ? "bg-white/20" : "bg-stone-100"
                    )}
                  >
                    {profile.stats.reviews}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          {tab === "listings" ? (
            <div>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-stone-900">
                    {t("profile.availableEquipment")}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {profile.stats.listings === 0
                      ? t("profile.noLiveListings")
                      : profile.stats.listings === 1
                        ? t("profile.itemReady", { count: profile.stats.listings })
                        : t("profile.itemsReady", { count: profile.stats.listings })}
                  </p>
                </div>
              </div>
              {profile.equipment.length > 0 ? (
                <EquipmentGrid equipment={profile.equipment} isLoading={false} columns={3} />
              ) : (
                <EmptyState
                  icon={Package}
                  title={t("listing.noListings")}
                  description={
                    isOwnProfile
                      ? t("profile.publishFromDashboard")
                      : t("profile.ownerNoEquipment")
                  }
                  action={
                    isOwnProfile
                      ? {
                          label: t("profile.createListing"),
                          onClick: () => navigate("/equipment/new"),
                        }
                      : undefined
                  }
                />
              )}
            </div>
          ) : null}

          {tab === "reviews" ? (
            <div className="mx-auto max-w-2xl space-y-6">
              <h2 className="font-display text-xl font-semibold text-stone-900">
                {t("equipment.reviews")}
              </h2>
              <p className="text-sm text-stone-500">{t("profile.reviewsHostSubtitle")}</p>
              {currentUser &&
              !isOwnProfile &&
              (profile.role === "OWNER" || profile.role === "BOTH") ? (
                <ReviewForm
                  variant="owner"
                  revieweeId={profile.id}
                  title={t("profile.reviewOwnerTitle")}
                  description={t("profile.reviewOwnerDesc")}
                  onSuccess={() => void loadProfile()}
                />
              ) : null}
              {profile.reviewsReceived.length > 0 ? (
                <div className="space-y-4">
                  {profile.reviewsReceived.map((r) => (
                    <div
                      key={r.id}
                      id={`highlight-${r.id}`}
                      className={cn(
                        "rounded-2xl transition-shadow duration-300",
                        highlightedReviewId === r.id && "ring-2 ring-brand-500 ring-offset-2"
                      )}
                    >
                      <ReviewCard review={r} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-200 bg-canvas-card px-6 py-12 text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-stone-300" aria-hidden />
                  <p className="mt-3 font-medium text-stone-700">{t("profile.noReviewsHostTitle")}</p>
                  <p className="mt-1 text-sm text-stone-500">{t("profile.noReviewsHostBody")}</p>
                </div>
              )}
            </div>
          ) : null}

          {tab === "about" ? (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  {t("profile.aboutSectionTitle")}
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                  {bioText}
                </p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                  {t("profile.trustTitle")}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-stone-600">
                  <li className="flex gap-2">
                    <span className="text-brand-500">✓</span>
                    {profile.kycStatus === "APPROVED"
                      ? t("profile.identityVerified", { name: PLATFORM_NAME })
                      : t("profile.identityPending")}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-500">✓</span>
                    {t("profile.memberSinceDate", { date: profile.createdAt.slice(0, 10) })}
                  </li>
                  {profile.location ? (
                    <li className="flex gap-2">
                      <span className="text-brand-500">✓</span>
                      {t("profile.basedIn", { location: profile.location })}
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
