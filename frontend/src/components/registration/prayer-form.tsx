"use client";

import { useRegistrationStore } from "@/lib/registration/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function PrayerForm() {
  const { data, updateData, setStep } = useRegistrationStore();

  return (
    <Card>
      <Textarea
        label="Do you have a prayer request? (Optional)"
        value={data.prayerRequest}
        onChange={(e) => updateData({ prayerRequest: e.target.value })}
        placeholder="Share your prayer request here..."
        rows={4}
      />
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={() => setStep("referral")}>
          Back
        </Button>
        <Button onClick={() => setStep("summary")} className="flex-1">
          {data.prayerRequest ? "Continue" : "Skip"}
        </Button>
      </div>
    </Card>
  );
}
