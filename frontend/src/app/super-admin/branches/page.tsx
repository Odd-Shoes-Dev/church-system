"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface BranchItem {
  id: string;
  name: string;
  location: string | null;
  country_code: string;
  is_main: boolean;
  is_active: boolean;
  member_count: string;
  admin_count: string;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [countryCode, setCountryCode] = useState("+256");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    return fetch("/api/super-admin/branches")
      .then((r) => r.json())
      .then((d) => setBranches(d.branches ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setName("");
    setLocation("");
    setCountryCode("+256");
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(b: BranchItem) {
    setName(b.name);
    setLocation(b.location ?? "");
    setCountryCode(b.country_code);
    setEditingId(b.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body: Record<string, unknown> = { name, location, countryCode };
    if (editingId) body.id = editingId;

    try {
      const res = await fetch("/api/super-admin/branches", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to save");
        setSaving(false);
        return;
      }

      resetForm();
      load();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function setAsMain(id: string) {
    await fetch("/api/super-admin/branches", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, setAsMain: true }),
    });
    load();
  }

  async function toggleActive(id: string, currentlyActive: boolean) {
    setTogglingId(id);
    await fetch("/api/super-admin/branches", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !currentlyActive }),
    });
    await load();
    setTogglingId(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)]">
          Branches
        </h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            Add Branch
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Branch Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kampala, Uganda"
            />
            <Input
              label="Default Country Code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              placeholder="+256"
            />
            {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} size="sm">
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => (
          <Card key={b.id}>
            <div className={!b.is_active ? "opacity-60" : ""}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-[var(--font-heading)] text-[var(--color-text)]">
                  {b.name}
                </span>
                {b.is_main && <Badge>Main</Badge>}
                {!b.is_active && <Badge variant="warning">Inactive</Badge>}
              </div>

              {b.location && (
                <p className="text-sm text-[var(--color-muted)] mb-2">
                  {b.location}
                </p>
              )}

              <div className="flex gap-4 text-sm mb-3">
                <span className="text-[var(--color-muted)]">
                  {b.member_count} members
                </span>
                <span className="text-[var(--color-muted)]">
                  {b.admin_count} admin{parseInt(b.admin_count) !== 1 ? "s" : ""}
                </span>
                <span className="text-[var(--color-muted)]">
                  {b.country_code}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(b)}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"
              >
                Edit
              </button>
              {!b.is_main && (
                <button
                  onClick={() => setAsMain(b.id)}
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"
                >
                  Set as Main
                </button>
              )}
              <button
                onClick={() => toggleActive(b.id, b.is_active)}
                disabled={togglingId === b.id}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer disabled:opacity-50 disabled:cursor-wait"
              >
                {togglingId === b.id
                  ? b.is_active ? "Deactivating..." : "Activating..."
                  : b.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
