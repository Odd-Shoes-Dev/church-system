"use client";

import { useRegistrationStore } from "@/lib/registration/store";
import { usePrefetchCache } from "@/lib/registration/prefetch-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function EventPicker() {
  const { data, updateData, setStep } = useRegistrationStore();
  const { cache } = usePrefetchCache();
  const [selected, setSelected] = useState(data.eventId ?? "");

  const events = cache.events ?? [];
  const loading = cache.loading.events;

  function handleNext() {
    const evt = events.find((e) => e.id === selected);
    updateData({ eventId: evt?.id ?? null, eventName: evt?.name ?? null });
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
