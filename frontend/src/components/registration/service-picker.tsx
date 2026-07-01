"use client";

import { useRegistrationStore } from "@/lib/registration/store";
import { usePrefetchCache } from "@/lib/registration/prefetch-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function ServicePicker() {
  const { data, updateData, setStep } = useRegistrationStore();
  const { cache } = usePrefetchCache();
  const [selected, setSelected] = useState(data.serviceId ?? "");
  const [attempted, setAttempted] = useState(false);

  const services = cache.services ?? [];
  const loading = cache.loading.services;

  function handleNext() {
    const svc = services.find((s) => s.id === selected);
    if (!svc) {
      setAttempted(true);
      return;
    }
    updateData({ serviceId: svc.id, serviceName: svc.name });
    setStep("event");
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
        name="service"
        label="Which service are you attending?"
        options={services.map((s) => ({ value: s.id, label: s.name }))}
        value={selected}
        onChange={(v) => { setSelected(v); setAttempted(false); }}
        error={attempted && !selected ? "Please select a service to continue." : undefined}
      />
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={() => setStep("first_time")}>
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
        </Button>
      </div>
    </Card>
  );
}
