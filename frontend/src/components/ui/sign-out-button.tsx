"use client";

import { useRouter } from "next/navigation";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className={className ?? "text-xs sm:text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"}
    >
      Sign out
    </button>
  );
}
