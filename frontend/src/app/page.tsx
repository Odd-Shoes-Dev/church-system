import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "super_admin") {
    redirect("/super-admin");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  redirect("/register");
}
