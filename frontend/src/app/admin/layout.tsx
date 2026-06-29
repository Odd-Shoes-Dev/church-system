import { requireAuth } from "@/lib/auth/guard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(["super_admin", "admin"]);

  return <>{children}</>;
}
