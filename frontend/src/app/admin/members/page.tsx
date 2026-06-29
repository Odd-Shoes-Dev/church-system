"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  age_group: string | null;
  district: string | null;
  occupation: string | null;
  marital_status: string | null;
  home_branch_name: string;
  visit_count: string;
  last_visit: string | null;
  is_first_time: boolean;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search.trim()) params.set("search", search.trim());

    fetch(`/api/admin/members?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setMembers(d.members ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  const totalPages = Math.ceil(total / 25);

  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)] mb-6">
        Members
      </h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="text-sm text-[var(--color-muted)] mb-3">
            {total} member{total !== 1 ? "s" : ""} found
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Name</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Phone</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Branch</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Gender</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Age Group</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Visits</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                    <td className="py-2 px-3 text-[var(--color-text)]">
                      {m.first_name} {m.last_name}
                      {m.is_first_time && <Badge variant="default" className="ml-2">New</Badge>}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{m.phone ?? "-"}</td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{m.home_branch_name}</td>
                    <td className="py-2 px-3 text-[var(--color-text)] capitalize">{m.gender ?? "-"}</td>
                    <td className="py-2 px-3 text-[var(--color-text)]">
                      {m.age_group?.replace("_", " ") ?? "-"}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{m.visit_count}</td>
                    <td className="py-2 px-3 text-[var(--color-muted)]">
                      {m.last_visit ? new Date(m.last_visit).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-[var(--color-muted)]">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
