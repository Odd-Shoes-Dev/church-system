"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SignOutButton } from "@/components/ui/sign-out-button";
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

interface Branch {
  id: string;
  name: string;
}

interface SidebarProps {
  userName: string;
  churchName: string;
  branchName: string;
  currentBranchId?: string;
  branches?: Branch[];
  role: string;
  isSuperAdmin?: boolean;
}

export function Sidebar({ userName, churchName, branchName, currentBranchId, branches = [], role, isSuperAdmin }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function handleSwitchBranch(branchId: string) {
    if (branchId === currentBranchId) { setDropdownOpen(false); return; }
    setSwitching(true);
    setDropdownOpen(false);
    await fetch("/api/auth/switch-branch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branchId }),
    });
    router.refresh();
    setSwitching(false);
  }

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] leading-tight">
          {churchName || "Administration"}
        </h2>

        {isSuperAdmin && branches.length > 1 ? (
          <div className="relative mt-1">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              disabled={switching}
              className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{switching ? "Switching..." : branchName}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
                className={clsx("transition-transform", dropdownOpen && "rotate-180")}
              >
                <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] shadow-md min-w-[180px] py-1 overflow-hidden">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSwitchBranch(b.id)}
                      className={clsx(
                        "w-full text-left px-3 py-2 text-xs transition-colors",
                        b.id === currentBranchId
                          ? "text-[var(--color-primary)] font-medium bg-[var(--color-primary)]/5"
                          : "text-[var(--color-text)] hover:bg-[var(--color-background)]"
                      )}
                    >
                      {b.name}
                      {b.id === currentBranchId && (
                        <span className="ml-1 text-[var(--color-muted)]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-muted)] mt-1">{branchName}</p>
        )}
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
        <SignOutButton className="mt-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer" />
      </div>
    </aside>
  );
}
