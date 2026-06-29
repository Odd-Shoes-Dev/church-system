"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CrudListProps {
  title: string;
  apiPath: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  onRefresh: () => void;
  extraFields?: {
    key: string;
    label: string;
    type: "text" | "number" | "date";
  }[];
}

export function CrudList({
  title,
  apiPath,
  items,
  onRefresh,
  extraFields,
}: CrudListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setName("");
    setExtras({});
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function startEdit(item: any) {
    setName(item.name);
    const ex: Record<string, string> = {};
    extraFields?.forEach((f) => {
      ex[f.key] = String(item[f.key] ?? "");
    });
    setExtras(ex);
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body: Record<string, unknown> = { name };
    extraFields?.forEach((f) => {
      if (f.type === "number") {
        body[f.key] = extras[f.key] ? Number(extras[f.key]) : null;
      } else {
        body[f.key] = extras[f.key] || null;
      }
    });

    if (editingId) body.id = editingId;

    try {
      const res = await fetch(apiPath, {
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
      onRefresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, currentlyActive: boolean) {
    await fetch(apiPath, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !currentlyActive }),
    });
    onRefresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)]">
          {title}
        </h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            Add New
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {extraFields?.map((f) => (
              <Input
                key={f.key}
                label={f.label}
                type={f.type}
                value={extras[f.key] ?? ""}
                onChange={(e) =>
                  setExtras((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
              />
            ))}
            {error && <p className="text-sm text-red-700">{error}</p>}
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

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="text-sm text-[var(--color-muted)] py-8 text-center">
            No items yet. Add one to get started.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)]"
          >
            <div className="flex items-center gap-3">
              <span className="text-[var(--color-text)]">{item.name}</span>
              {!item.is_active && <Badge variant="muted">Inactive</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(item)}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => toggleActive(item.id, item.is_active)}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"
              >
                {item.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
