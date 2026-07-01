"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function LogoUpload() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadLogo = useCallback(() => {
    setLoading(true);
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(async (d) => {
        if (d.user) {
          const res = await fetch(
            `/api/admin/settings/tenant?tenantId=${d.user.tenantId}`
          );
          const data = await res.json();
          setLogoUrl(data.tenant?.logo_url ?? null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadLogo(); }, [loadLogo]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("/api/admin/settings/logo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Upload failed");
        setUploading(false);
        return;
      }

      const data = await res.json();
      setLogoUrl(data.url);
    } catch {
      setError("Upload failed. Make sure ImageKit is configured.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!confirm("Remove the church logo? This cannot be undone.")) return;
    await fetch("/api/admin/settings/logo", { method: "DELETE" });
    setLogoUrl(null);
  }

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle className="mb-4">Church Logo</CardTitle>

      {logoUrl ? (
        <div className="flex items-center gap-4 mb-4">
          <img
            src={logoUrl}
            alt="Church logo"
            className="w-20 h-20 object-contain rounded-[var(--radius)] border border-[var(--color-border)]"
          />
          <div>
            <p className="text-sm text-[var(--color-muted)]">Current logo</p>
            <button
              onClick={handleRemove}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer mt-1"
            >
              Remove logo
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--color-muted)] mb-4">
          No logo uploaded. Upload an image to display on registration pages.
        </p>
      )}

      <div>
        <label className="inline-block cursor-pointer">
          <span className="sr-only">Upload logo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm text-[var(--color-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-[var(--radius)] file:border file:border-[var(--color-border)] file:text-sm file:text-[var(--color-text)] file:bg-[var(--color-surface)] file:cursor-pointer hover:file:bg-[var(--color-background)]"
          />
        </label>
        {uploading && (
          <p className="text-xs text-[var(--color-muted)] mt-2">
            Uploading...
          </p>
        )}
        {error && <p className="text-xs text-red-700 mt-2">{error}</p>}
      </div>
    </Card>
  );
}
