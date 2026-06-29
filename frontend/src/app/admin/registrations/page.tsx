"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface Registration {
  id: string;
  registered_at: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  service_name: string;
  event_name: string | null;
  registered_by_name: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (date) params.set("date", date);

    fetch(`/api/admin/registrations?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setRegistrations(d.registrations ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, date]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 25);

  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)] mb-6">
        Registrations
      </h1>

      <div className="flex gap-2 items-end mb-6">
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setDate(""); setPage(1); }}
        >
          Show All
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="text-sm text-[var(--color-muted)] mb-3">
            {total} registration{total !== 1 ? "s" : ""}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Time</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Name</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Phone</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Service</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Event</th>
                  <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">Registered By</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                    <td className="py-2 px-3 text-[var(--color-muted)]">
                      {new Date(r.registered_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-text)]">
                      {r.first_name} {r.last_name}
                    </td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{r.phone ?? "-"}</td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{r.service_name}</td>
                    <td className="py-2 px-3 text-[var(--color-text)]">{r.event_name ?? "-"}</td>
                    <td className="py-2 px-3 text-[var(--color-muted)]">{r.registered_by_name}</td>
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
