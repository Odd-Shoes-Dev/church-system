"use client";

import { useEffect, useState, useCallback } from "react";
import { CrudList } from "@/components/admin/crud-list";

interface EventItem {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  const load = useCallback(() => {
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <CrudList
      title="Events"
      apiPath="/api/admin/events"
      items={events}
      onRefresh={load}
      extraFields={[
        { key: "startDate", label: "Start Date", type: "date" },
        { key: "endDate", label: "End Date", type: "date" },
      ]}
    />
  );
}
