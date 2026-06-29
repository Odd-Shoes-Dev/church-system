import { redirect } from "next/navigation";
import { getSessionUser } from "./session";
import type { Role, SessionUser } from "./types";

export async function requireAuth(
  allowedRoles?: Role[]
): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/login");
  }

  return user;
}

export function canEditMember(
  user: SessionUser,
  memberHomeBranchId: string
): boolean {
  if (user.role === "super_admin") return true;
  if (user.role === "admin" && user.branchId === memberHomeBranchId)
    return true;
  return false;
}
