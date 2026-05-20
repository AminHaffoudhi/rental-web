import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyBookingCard } from "@/components/booking/MyBookingCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useMyBookings } from "@/hooks/useBooking";
import { CalendarDays } from "lucide-react";
import { cn } from "@/utils/cn";

export function Bookings() {
  const { bookings, isLoading, error, refetch } = useMyBookings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="container max-w-4xl py-10">
          <LoadingSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (error || !bookings) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="container max-w-4xl py-16 text-center text-red-600">
          {error?.message ?? "Could not load bookings"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container max-w-4xl pb-16 pt-10">
        <h1 className="font-display text-3xl font-semibold text-stone-900">My Bookings</h1>
        <p className="mt-2 text-stone-500">
          Track rentals you’ve made and requests for your listings.
        </p>

        <Tabs defaultValue="renter" className="mt-10">
          <TabsList className="scrollbar-hide flex h-auto w-full flex-wrap justify-start gap-2 rounded-none bg-transparent p-0">
            <TabsTrigger
              value="renter"
              className={cn(
                "group rounded-full border px-5 py-2.5 text-sm font-medium shadow-none transition-colors",
                "data-[state=active]:border-brand-500 data-[state=active]:bg-brand-500 data-[state=active]:text-white",
                "data-[state=inactive]:border-stone-200 data-[state=inactive]:bg-white data-[state=inactive]:text-stone-600 hover:data-[state=inactive]:border-stone-300"
              )}
            >
              I’m renting
              <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                {bookings.asRenter.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="owner"
              className={cn(
                "group rounded-full border px-5 py-2.5 text-sm font-medium shadow-none transition-colors",
                "data-[state=active]:border-brand-500 data-[state=active]:bg-brand-500 data-[state=active]:text-white",
                "data-[state=inactive]:border-stone-200 data-[state=inactive]:bg-white data-[state=inactive]:text-stone-600 hover:data-[state=inactive]:border-stone-300"
              )}
            >
              My equipment
              <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                {bookings.asOwner.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="renter" className="mt-8 space-y-4 focus-visible:outline-none">
            {bookings.asRenter.length ? (
              bookings.asRenter.map((b) => (
                <MyBookingCard
                  key={b.id}
                  booking={b}
                  perspective="renter"
                  onUpdated={() => refetch()}
                />
              ))
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No rentals yet"
                subtitle="Browse listings and send your first booking request."
              />
            )}
          </TabsContent>

          <TabsContent value="owner" className="mt-8 space-y-4 focus-visible:outline-none">
            {bookings.asOwner.length ? (
              bookings.asOwner.map((b) => (
                <MyBookingCard
                  key={b.id}
                  booking={b}
                  perspective="owner"
                  onUpdated={() => refetch()}
                />
              ))
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No incoming bookings"
                subtitle="Create a listing to receive booking requests."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
