"use client";

import { useEffect } from "react";
import { useRegistrationStore } from "@/lib/registration/store";
import { usePrefetchCache } from "@/lib/registration/prefetch-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface MemberMatch {
  id: string;
  first_name: string;
  last_name: string;
  home_branch_name: string;
  last_visit: string | null;
}

export function PhoneLookup() {
  const { data, updateData, setStep } = useRegistrationStore();
  const { cache, prefetchMembers } = usePrefetchCache();
  const [selected, setSelected] = useState<string | null>(data.existingMemberId);

  // If user somehow arrived here without triggering prefetch, kick it off now
  useEffect(() => {
    if (data.phone && cache.memberLookup?.phone !== data.phone && !cache.loading.memberLookup) {
      prefetchMembers(data.phone);
    }
  }, [data.phone, cache.memberLookup, cache.loading.memberLookup, prefetchMembers]);

  const loading = cache.loading.memberLookup ||
    (data.phone ? cache.memberLookup?.phone !== data.phone : false);

  // Only use cached results if they match the current phone
  const matches: MemberMatch[] =
    cache.memberLookup?.phone === data.phone ? cache.memberLookup.members : [];

  function handleContinueAsNew() {
    updateData({ existingMemberId: null });
    setStep("referral");
  }

  function handleSelectMember(m: MemberMatch) {
    setSelected(m.id);
    updateData({
      existingMemberId: m.id,
      firstName: m.first_name,
      lastName: m.last_name,
    });
  }

  function handleConfirmSelection() {
    setStep("referral");
  }

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <Spinner />
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <p className="text-[var(--color-text)] mb-4">
          No existing records found for this phone number. You will be
          registered as a new member.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setStep("details")}>
            Back
          </Button>
          <Button onClick={handleContinueAsNew} className="flex-1">
            Continue
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-[var(--color-text)] mb-4">
        We found {matches.length} record{matches.length > 1 ? "s" : ""} with
        this phone number. Is one of these you?
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {matches.map((m) => (
          <label
            key={m.id}
            className={`flex items-center justify-between px-4 py-3 rounded-[var(--radius)] border cursor-pointer transition-all ${
              selected === m.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                : "border-[var(--color-border)] hover:border-[var(--color-secondary)]"
            }`}
            onClick={() => handleSelectMember(m)}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="member"
                checked={selected === m.id}
                onChange={() => handleSelectMember(m)}
                className="accent-[var(--color-primary)]"
              />
              <div>
                <span className="font-[var(--font-body)] text-[var(--color-text)]">
                  {m.first_name} {m.last_name}
                </span>
                <p className="text-xs text-[var(--color-muted)]">
                  {m.home_branch_name}
                  {m.last_visit && ` — Last visit: ${m.last_visit}`}
                </p>
              </div>
            </div>
            <Badge variant="muted">Member</Badge>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => setStep("details")}>
          Back
        </Button>
        {selected ? (
          <Button onClick={handleConfirmSelection} className="flex-1">
            That is me
          </Button>
        ) : (
          <Button onClick={handleContinueAsNew} variant="outline" className="flex-1">
            None of these, register as new
          </Button>
        )}
      </div>
    </Card>
  );
}
