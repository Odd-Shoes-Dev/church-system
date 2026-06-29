"use client";

import { ThemeEditor } from "@/components/admin/theme-editor";
import { LogoUpload } from "@/components/admin/logo-upload";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)] mb-6">
        Settings
      </h1>

      <div className="flex flex-col gap-8">
        <LogoUpload />
        <ThemeEditor />
      </div>
    </div>
  );
}
