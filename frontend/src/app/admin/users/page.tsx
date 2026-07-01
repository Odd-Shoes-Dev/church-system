"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  branch_name: string;
  created_at: string;
}

const ROLE_OPTIONS = [
  { value: "registrar", label: "Registrar" },
  { value: "admin", label: "Admin" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("registrar");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []));
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("registrar");
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to create user");
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

  async function toggleActive(id: string, currentlyActive: boolean) {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !currentlyActive }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)]">
          Users
        </h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            Add User
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 8 characters"
            />
            <Select
              label="Role"
              options={ROLE_OPTIONS}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} size="sm">
                {saving ? "Creating..." : "Create User"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {users.length === 0 && (
          <p className="text-sm text-[var(--color-muted)] py-8 text-center">
            No users yet.
          </p>
        )}
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)]"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text)]">{u.name}</span>
                <Badge variant={u.role === "admin" ? "default" : "muted"}>
                  {u.role.replace("_", " ")}
                </Badge>
                {!u.is_active && <Badge variant="warning">Inactive</Badge>}
              </div>
              <p className="text-xs text-[var(--color-muted)]">
                {u.email} -- {u.branch_name}
              </p>
            </div>
            <button
              onClick={() => toggleActive(u.id, u.is_active)}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"
            >
              {u.is_active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
