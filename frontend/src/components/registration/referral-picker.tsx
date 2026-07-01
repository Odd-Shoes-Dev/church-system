"use client";

import { useRegistrationStore } from "@/lib/registration/store";
import { usePrefetchCache } from "@/lib/registration/prefetch-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function ReferralPicker() {
  const { data, updateData, setStep } = useRegistrationStore();
  const { cache } = usePrefetchCache();
  const [selected, setSelected] = useState(data.referralSourceId ?? "");

  const sources = cache.referralSources ?? [];
  const loading = cache.loading.referralSources;

  function handleNext() {
    const src = sources.find((s) => s.id === selected);
    updateData({
      referralSourceId: src?.id ?? null,
      referralSourceName: src?.name ?? null,
    });
    setStep("prayer");
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
        name="referral"
        label="How did you hear about us?"
        options={sources.map((s) => ({ value: s.id, label: s.name }))}
        value={selected}
        onChange={setSelected}
      />
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={() => setStep("lookup")}>
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          {selected ? "Continue" : "Skip"}
        </Button>
      </div>
    </Card>
  );
}
