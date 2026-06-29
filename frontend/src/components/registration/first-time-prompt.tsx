"use client";

import { useRegistrationStore } from "@/lib/registration/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FirstTimePrompt() {
  const { updateData, setStep } = useRegistrationStore();

  function handleSelect(isFirstTime: boolean) {
    updateData({ isFirstTime });
    setStep("service");
  }

  return (
    <Card>
      <p className="text-[var(--color-text)] mb-6">
        Is this your first time visiting?
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => handleSelect(true)}
        >
          Yes, first time
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => handleSelect(false)}
        >
          No, I have been here before
        </Button>
      </div>
    </Card>
  );
}
