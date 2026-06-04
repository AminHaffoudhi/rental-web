import type { BookingStatus } from "@/types/booking";

export interface OwnerDashboardSummary {
  totalEarningsGross: number;
  totalEarningsNet: number;
  earningsThisMonthGross: number;
  earningsThisMonthNet: number;
  monthOverMonthChangePct: number | null;
  pendingPayout: number;
  totalListings: number;
  liveListings: number;
  pendingApprovalListings: number;
  totalBookings: number;
  pendingRequests: number;
  activeRentals: number;
  completedBookings: number;
  avgRating: number | null;
  totalReviews: number;
}

export interface OwnerListingsBreakdown {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  live: number;
  hidden: number;
}

export interface OwnerEarningsMonth {
  month: string;
  label: string;
  gross: number;
  net: number;
  bookings: number;
}

export interface OwnerBookingsTrendDay {
  date: string;
  label: string;
  count: number;
}

export interface OwnerTopEquipment {
  id: string;
  title: string;
  image: string | null;
  bookings: number;
  revenueGross: number;
  revenueNet: number;
}

export interface OwnerEquipmentByCategory {
  categoryId: string;
  categoryName: string;
  count: number;
}

export interface OwnerDashboardData {
  summary: OwnerDashboardSummary;
  listingsBreakdown: OwnerListingsBreakdown;
  bookingsByStatus: { status: BookingStatus; count: number }[];
  earningsByMonth: OwnerEarningsMonth[];
  bookingsTrend: OwnerBookingsTrendDay[];
  topEquipment: OwnerTopEquipment[];
  equipmentByCategory: OwnerEquipmentByCategory[];
}
