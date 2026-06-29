"use client";

import { useEffect, useState, useCallback } from "react";
import { CrudList } from "@/components/admin/crud-list";

interface Service {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const load = useCallback(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudList
      title="Services"
      apiPath="/api/admin/services"
      items={services}
      onRefresh={load}
      extraFields={[{ key: "sortOrder", label: "Sort Order", type: "number" }]}
    />
  );
}
