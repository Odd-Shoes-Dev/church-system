"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/super-admin", label: "Overview" },
  { href: "/super-admin/branches", label: "Branches" },
  { href: "/super-admin/members", label: "All Members" },
  { href: "/super-admin/analytics", label: "Analytics" },
  { href: "/super-admin/export", label: "Export Data" },
];

interface SidebarProps {
  userName: string;
  tenantName: string;
}

export function SuperAdminSidebar({ userName, tenantName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-[var(--font-heading)] text-[var(--color-text)]">
          Church Overview
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">{tenantName}</p>
      </div>

      <div className="p-3 border-b border-[var(--color-border)]">
        <Link
          href="/register"
          className="block w-full text-center px-3 py-2 rounded-[var(--radius)] text-sm font-medium bg-[var(--color-primary)] text-[var(--color-background)] hover:opacity-90 transition-opacity"
        >
          New Registration
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/super-admin"
              ? pathname === "/super-admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "px-3 py-2 rounded-[var(--radius)] text-sm transition-colors",
                isActive
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-text)] hover:bg-[var(--color-background)]"
              )}
            >
              {item.label}
            </Link>
          );
        })}

        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <p className="px-3 text-xs text-[var(--color-muted)] mb-2 uppercase tracking-wide">
            Branch Admin
          </p>
          <Link
            href="/admin"
            className="px-3 py-2 rounded-[var(--radius)] text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] block"
          >
            Switch to Branch View
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text)] truncate">{userName}</p>
        <p className="text-xs text-[var(--color-muted)]">Super Admin</p>
        <button
          onClick={handleSignOut}
          className="mt-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
