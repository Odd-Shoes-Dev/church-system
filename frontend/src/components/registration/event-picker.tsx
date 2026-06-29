"use client";

import { useEffect, useState } from "react";
import { useRegistrationStore } from "@/lib/registration/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";

interface EventOption {
  id: string;
  name: string;
}

export function EventPicker() {
  const { data, updateData, setStep } = useRegistrationStore();
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(data.eventId ?? "");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .finally(() => setLoading(false));
  }, []);

  function handleNext() {
    const evt = events.find((e) => e.id === selected);
    updateData({
      eventId: evt?.id ?? null,
      eventName: evt?.name ?? null,
    });
    setStep("details");
  }

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <Spinner />
      </Card>
    );
  }

  return (
    <Card>
      <RadioGroup
        name="event"
        label="Are you here for a special event?"
        options={events.map((e) => ({ value: e.id, label: e.name }))}
        value={selected}
        onChange={setSelected}
      />
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={() => setStep("service")}>
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          {selected ? "Continue" : "Skip"}
        </Button>
      </div>
    </Card>
  );
}
