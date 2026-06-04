import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { OwnerOnlyRoute } from "@/components/auth/OwnerOnlyRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { BookingDetail } from "@/pages/BookingDetail";
import { Bookings } from "@/pages/Bookings";
import { Dashboard } from "@/pages/Dashboard";
import { DashboardBookings } from "@/pages/DashboardBookings";
import { DashboardAssistant } from "@/pages/DashboardAssistant";
import { DashboardEarnings } from "@/pages/DashboardEarnings";
import { OwnerAssistant } from "@/pages/OwnerAssistant";
import { DashboardListings } from "@/pages/DashboardListings";
import { EquipmentDetail } from "@/pages/EquipmentDetail";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { NewListing } from "@/pages/NewListing";
import { NotFound } from "@/pages/NotFound";
import { Profile } from "@/pages/Profile";
import { PublicProfile } from "@/pages/PublicProfile";
import { Register } from "@/pages/Register";
import { Search } from "@/pages/Search";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { TermsOfService } from "@/pages/TermsOfService";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { CookiePolicy } from "@/pages/CookiePolicy";
import { Contact } from "@/pages/Contact";

function RedirectLegacyProfile() {
  const { userId } = useParams<{ userId: string }>();
  return <Navigate to={userId ? `/users/${userId}` : "/search"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/assistant" element={<DashboardAssistant />} />
          <Route path="/profile" element={<Profile />} />
          <Route element={<OwnerOnlyRoute />}>
            <Route path="/dashboard/ai" element={<OwnerAssistant />} />
            <Route path="/dashboard/listings" element={<DashboardListings />} />
            <Route path="/dashboard/bookings" element={<DashboardBookings />} />
            <Route path="/dashboard/earnings" element={<DashboardEarnings />} />
            <Route path="/equipment/new" element={<NewListing />} />
          </Route>
        </Route>
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/equipment/:id" element={<EquipmentDetail />} />
        <Route path="/users/:userId" element={<PublicProfile />} />
        <Route path="/profile/:userId" element={<RedirectLegacyProfile />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
