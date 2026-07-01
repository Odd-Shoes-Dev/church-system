"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/referral-sources", label: "Referral Sources" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
];

interface SidebarProps {
  userName: string;
  churchName: string;
  branchName: string;
  role: string;
  isSuperAdmin?: boolean;
}

export function Sidebar({ userName, churchName, branchName, role, isSuperAdmin }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] leading-tight">
          {churchName || "Administration"}
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">{branchName}</p>
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
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          if (item.href === "/admin/users" && role === "registrar") {
            return null;
          }
          if (item.href === "/admin/settings" && role === "registrar") {
            return null;
          }

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
        {isSuperAdmin && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <p className="px-3 text-xs text-[var(--color-muted)] mb-2 uppercase tracking-wide">
              Super Admin
            </p>
            <Link
              href="/super-admin"
              className="px-3 py-2 rounded-[var(--radius)] text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] block"
            >
              Church Overview
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text)] truncate">{userName}</p>
        <p className="text-xs text-[var(--color-muted)] capitalize">
          {role.replace("_", " ")}
        </p>
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
