"use client";

import { useEffect, useState } from "react";
import { useRegistrationStore } from "@/lib/registration/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";

interface ReferralSource {
  id: string;
  name: string;
}

export function ReferralPicker() {
  const { data, updateData, setStep } = useRegistrationStore();
  const [sources, setSources] = useState<ReferralSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(data.referralSourceId ?? "");

  useEffect(() => {
    fetch("/api/referral-sources")
      .then((r) => r.json())
      .then((d) => setSources(d.sources ?? []))
      .finally(() => setLoading(false));
  }, []);

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
