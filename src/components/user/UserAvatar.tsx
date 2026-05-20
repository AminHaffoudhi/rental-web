import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/user";
import { cn } from "@/utils/cn";

export type AvatarUser = Pick<User, "name" | "image"> | null;

interface UserAvatarProps {
  user: AvatarUser;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <Avatar className={cn(sizes[size], className)}>
      {user?.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
