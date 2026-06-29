import { requireAuth } from "@/lib/auth/guard";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(["super_admin"]);

  return <>{children}</>;
}
