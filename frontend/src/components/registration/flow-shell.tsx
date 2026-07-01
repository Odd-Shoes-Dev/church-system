"use client";

import { useRegistrationStore } from "@/lib/registration/store";
import { RegistrationPrefetchProvider } from "@/lib/registration/prefetch-context";
import { ProgressBar } from "@/components/ui/progress-bar";
import { FirstTimePrompt } from "./first-time-prompt";
import { ServicePicker } from "./service-picker";
import { EventPicker } from "./event-picker";
import { DetailsForm } from "./details-form";
import { PhoneLookup } from "./phone-lookup";
import { ReferralPicker } from "./referral-picker";
import { PrayerForm } from "./prayer-form";
import { SummaryCard } from "./summary-card";
import type { RegistrationStep } from "@/lib/registration/types";

const STEPS: RegistrationStep[] = [
  "first_time",
  "service",
  "event",
  "details",
  "lookup",
  "referral",
  "prayer",
  "summary",
];

const STEP_TITLES: Record<RegistrationStep, string> = {
  first_time: "Welcome",
  service: "Service",
  event: "Event",
  details: "Your Details",
  lookup: "Verify Identity",
  referral: "How Did You Hear About Us",
  prayer: "Prayer Request",
  summary: "Confirmation",
};

export function RegistrationFlow() {
  const { step } = useRegistrationStore();
  const stepIndex = STEPS.indexOf(step);

  return (
    <RegistrationPrefetchProvider>
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-[var(--font-heading)] text-[var(--color-text)]">
          {STEP_TITLES[step]}
        </h2>
        <ProgressBar current={stepIndex + 1} total={STEPS.length} className="mt-3" />
      </div>

      {step === "first_time" && <FirstTimePrompt />}
      {step === "service" && <ServicePicker />}
      {step === "event" && <EventPicker />}
      {step === "details" && <DetailsForm />}
      {step === "lookup" && <PhoneLookup />}
      {step === "referral" && <ReferralPicker />}
      {step === "prayer" && <PrayerForm />}
      {step === "summary" && <SummaryCard />}
    </div>
    </RegistrationPrefetchProvider>
  );
}
