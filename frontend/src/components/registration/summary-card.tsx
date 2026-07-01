"use client";

import { useState } from "react";
import { useRegistrationStore } from "@/lib/registration/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-b-0">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <span className="text-sm text-[var(--color-text)] text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

export function SummaryCard() {
  const { data, setStep, reset } = useRegistrationStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(andNew: boolean) {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to save registration");
        setSaving(false);
        return;
      }

      if (andNew) {
        reset();
      } else {
        reset();
        // Show a brief confirmation before resetting
        setError("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex flex-col">
        <Row label="First Time" value={data.isFirstTime ? "Yes" : "No"} />
        <Row label="Service" value={data.serviceName} />
        <Row label="Event" value={data.eventName} />
        <Row label="Name" value={`${data.firstName} ${data.lastName}`} />
        <Row label="Phone" value={data.phone} />
        <Row label="Email" value={data.email || null} />
        <Row label="Gender" value={data.gender} />
        <Row
          label="Age Group"
          value={data.ageGroup?.replace("_", " ") ?? null}
        />
        <Row label="District" value={data.district || null} />
        <Row label="Occupation" value={data.occupation || null} />
        <Row label="Marital Status" value={data.maritalStatus} />
        <Row label="How Heard" value={data.referralSourceName} />
        <Row
          label="Prayer Request"
          value={data.prayerRequest || null}
        />
        {data.existingMemberId && (
          <Row label="Status" value="Returning member" />
        )}
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)] mt-4">{error}</p>
      )}

      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={() => setStep("prayer")}>
          Back
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          Save and Register Another
        </Button>
        <Button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex-1"
        >
          {saving ? "Saving..." : "Save and Done"}
        </Button>
      </div>
    </Card>
  );
}
