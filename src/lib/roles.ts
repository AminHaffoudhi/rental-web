import type { Role } from "@/types/user";

export function isOwnerRole(role?: Role | string | null): boolean {
  return role === "OWNER" || role === "BOTH";
}

export function isRenterOnly(role?: Role | string | null): boolean {
  return role === "RENTER";
}
