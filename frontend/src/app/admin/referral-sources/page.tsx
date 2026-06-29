"use client";

import { useEffect, useState, useCallback } from "react";
import { CrudList } from "@/components/admin/crud-list";

interface Source {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export default function ReferralSourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);

  const load = useCallback(() => {
    fetch("/api/admin/referral-sources")
      .then((r) => r.json())
      .then((d) => setSources(d.sources ?? []));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudList
      title="Referral Sources"
      apiPath="/api/admin/referral-sources"
      items={sources}
      onRefresh={load}
      extraFields={[{ key: "sortOrder", label: "Sort Order", type: "number" }]}
    />
  );
}
