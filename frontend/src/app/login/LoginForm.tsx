"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface BranchOption {
  id: string;
  name: string;
  location: string | null;
  is_main: boolean;
}

export default function LoginForm({ tenantName }: { tenantName: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<BranchOption[] | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  async function handleLogin(branchId?: string) {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, branchId }),
      });

      const data = await res.json();

      if (data.requireBranchSelection) {
        setBranches(data.branches);
        if (data.branches.length > 0) {
          setSelectedBranch(data.branches[0].id);
        }
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        setLoading(false);
        return;
      }

      if (data.user.role === "super_admin") {
        router.push("/super-admin");
      } else if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/register");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {tenantName && (
            <>
              <p
                className="text-center text-xl font-semibold tracking-wide"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-primary)",
                }}
              >
                {tenantName}
              </p>
              <hr
                className="my-3"
                style={{ borderColor: "var(--color-border)" }}
              />
            </>
          )}
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
          <p className="text-center text-sm text-[var(--color-muted)] mt-1">
            Enter your credentials to continue
          </p>
        </CardHeader>

        {!branches ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="flex flex-col gap-4"
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@church.org"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {error && (
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--color-text)]">
              Select a branch to continue:
            </p>
            <div className="flex flex-col gap-2">
              {branches.map((b) => (
                <label
                  key={b.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] border cursor-pointer transition-all ${
                    selectedBranch === b.id
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                      : "border-[var(--color-border)] hover:border-[var(--color-secondary)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="branch"
                    value={b.id}
                    checked={selectedBranch === b.id}
                    onChange={() => setSelectedBranch(b.id)}
                    className="accent-[var(--color-primary)]"
                  />
                  <div>
                    <span className="font-[var(--font-body)] text-[var(--color-text)]">
                      {b.name}
                    </span>
                    {b.is_main && (
                      <span className="ml-2 text-xs text-[var(--color-muted)]">
                        Main Branch
                      </span>
                    )}
                    {b.location && (
                      <p className="text-xs text-[var(--color-muted)]">
                        {b.location}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}
            <Button
              onClick={() => handleLogin(selectedBranch)}
              disabled={loading || !selectedBranch}
              className="w-full"
            >
              {loading ? "Signing in..." : "Continue"}
            </Button>
            <button
              onClick={() => {
                setBranches(null);
                setError("");
              }}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"
            >
              Back to login
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
