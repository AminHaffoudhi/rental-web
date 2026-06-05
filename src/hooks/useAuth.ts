import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { identifyUser, logoutOneSignal } from "@/lib/onesignal";
import * as authService from "@/services/auth.service";
import type { LoginData, RegisterData } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  async function login(data: LoginData) {
    const result = await authService.login(data);
    setAuth(result.user, result.token);
    toast.success("Welcome back!");
    void identifyUser(result.user.id, result.user.role).catch(() => {});
    const redirectTo =
      (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/dashboard";
    navigate(redirectTo, { replace: true });
  }

  async function register(data: RegisterData) {
    const result = await authService.register(data);
    setAuth(result.user, result.token);
    toast.success(result.message);
    // Email OTP disabled temporarily — go straight to dashboard after signup.
    // navigate("/verify-email", { replace: true, state: { email: data.email } });
    navigate("/dashboard", { replace: true });
  }

  function logout() {
    void logoutOneSignal().catch(() => {});
    clearAuth();
    toast.success("Logged out");
    navigate("/", { replace: true });
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
