import { useParams } from "react-router-dom";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import { ReviewCard } from "@/components/user/ReviewCard";
import { UserAvatar } from "@/components/user/UserAvatar";
import { RatingStars } from "@/components/user/RatingStars";
import { useEffect, useMemo, useState } from "react";
import * as userService from "@/services/user.service";
import type { PublicUserProfile } from "@/services/user.service";

export function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void userService
      .getPublicProfile(userId)
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch(() => {
        if (!cancelled) setError("User not found");
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const avgReviews = useMemo(() => {
    if (!profile?.reviewsReceived?.length) return null;
    const s = profile.reviewsReceived.reduce((acc, r) => acc + r.rating, 0);
    return s / profile.reviewsReceived.length;
  }, [profile]);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-red-600">{error}</div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-stone-500">Loading…</div>
    );
  }

  const userLike = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    image: profile.image ?? undefined,
    role: profile.role,
    kycStatus: "PENDING" as const,
    createdAt: profile.createdAt,
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-brand-50 py-12">
        <div className="container flex flex-col items-center text-center md:flex-row md:items-start md:gap-10 md:text-left">
          <UserAvatar user={userLike} size="lg" className="h-24 w-24 text-2xl" />
          <div className="mt-6 md:mt-0">
            <h1 className="font-display text-3xl font-semibold text-stone-900">{profile.name}</h1>
            <p className="mt-2 text-sm text-stone-600">
              Member since {profile.createdAt.slice(0, 10)}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {avgReviews !== null ? (
                <>
                  <RatingStars rating={Math.round(avgReviews)} size="sm" />
                  <span className="text-sm text-stone-600">
                    {avgReviews.toFixed(1)} · {profile.reviewsReceived.length} reviews
                  </span>
                </>
              ) : (
                <span className="text-sm text-stone-500">No reviews yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container grid gap-10 py-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="font-display mb-6 text-xl font-semibold text-stone-900">Listings</h2>
          <EquipmentGrid equipment={profile.equipment} isLoading={false} columns={2} />
        </div>
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h2 className="font-display mb-3 text-xl font-semibold text-stone-900">About</h2>
            <p className="text-sm leading-relaxed text-stone-600">
              Trusted equipment owner on RentMarket. Response rate typically within a few hours.
            </p>
          </div>
          <div>
            <h2 className="font-display mb-4 text-xl font-semibold text-stone-900">
              Reviews received
            </h2>
            <div className="space-y-4">
              {profile.reviewsReceived.length ? (
                profile.reviewsReceived.map((r) => <ReviewCard key={r.id} review={r} />)
              ) : (
                <p className="text-sm text-stone-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
