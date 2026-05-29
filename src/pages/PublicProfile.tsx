import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Package, Sparkles, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { OwnerProfileHero } from "@/components/user/OwnerProfileHero";
import { ReviewForm } from "@/components/review/ReviewForm";
import { ReviewCard } from "@/components/user/ReviewCard";
import { useAuthStore } from "@/store/authStore";
import * as userService from "@/services/user.service";
import type { PublicUserProfile } from "@/services/user.service";
import { cn } from "@/utils/cn";
import { useNotificationHighlight } from "@/hooks/useNotificationHighlight";

type ProfileTab = "listings" | "reviews" | "about";

const tabs: { id: ProfileTab; label: string; icon: typeof Package }[] = [
  { id: "listings", label: "Listings", icon: Package },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
  { id: "about", label: "About", icon: User },
];

export function PublicProfile() {
  const navigate = useNavigate();
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
      setError("This profile could not be found.");
    }
  }, [userId]);

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

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-stone-600">{error}</p>
        <Link to="/search" className="btn btn-primary">
          Browse equipment
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-stone-100">
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

  const bioText =
    profile.bio?.trim() ||
    (profile.role === "OWNER" || profile.role === "BOTH"
      ? `${profile.name} rents out quality equipment on RentMarket. Browse their listings below and book with confidence.`
      : `${profile.name} is a member of the RentMarket community.`);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200/80 bg-stone-900/5">
        <div className="container flex items-center gap-2 py-3">
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to search
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
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
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
                    Available equipment
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {profile.stats.listings === 0
                      ? "No live listings right now."
                      : `${profile.stats.listings} item${profile.stats.listings !== 1 ? "s" : ""} ready to rent`}
                  </p>
                </div>
              </div>
              {profile.equipment.length > 0 ? (
                <EquipmentGrid equipment={profile.equipment} isLoading={false} columns={3} />
              ) : (
                <EmptyState
                  icon={Package}
                  title="No listings yet"
                  description={
                    isOwnProfile
                      ? "Publish your first listing from the dashboard to show it here."
                      : "This owner has not published any available equipment yet."
                  }
                  action={
                    isOwnProfile
                      ? {
                          label: "Create listing",
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
                Reviews
              </h2>
              <p className="text-sm text-stone-500">
                Host feedback and reviews on this owner&apos;s listings.
              </p>
              {currentUser &&
              !isOwnProfile &&
              (profile.role === "OWNER" || profile.role === "BOTH") ? (
                <ReviewForm
                  variant="owner"
                  revieweeId={profile.id}
                  title="Review this owner"
                  description="Share your experience working with this host. Owners can also review each other."
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
                <div className="rounded-2xl border border-dashed border-stone-200 bg-white px-6 py-12 text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-stone-300" aria-hidden />
                  <p className="mt-3 font-medium text-stone-700">No reviews yet</p>
                  <p className="mt-1 text-sm text-stone-500">
                    Be the first to leave a review after renting or interacting with this host.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {tab === "about" ? (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-stone-900">About</h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                  {bioText}
                </p>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                  Trust & verification
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-stone-600">
                  <li className="flex gap-2">
                    <span className="text-brand-500">✓</span>
                    {profile.kycStatus === "APPROVED"
                      ? "Identity verified by RentMarket"
                      : "Identity verification pending"}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-500">✓</span>
                    Member since {profile.createdAt.slice(0, 10)}
                  </li>
                  {profile.location ? (
                    <li className="flex gap-2">
                      <span className="text-brand-500">✓</span>
                      Based in {profile.location}
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
