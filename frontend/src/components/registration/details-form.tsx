"use client";

import { useState } from "react";
import { useRegistrationStore } from "@/lib/registration/store";
import { detailsSchema } from "@/lib/registration/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const AGE_GROUP_OPTIONS = [
  { value: "child", label: "Child (0-12)" },
  { value: "teen", label: "Teen (13-17)" },
  { value: "young_adult", label: "Young Adult (18-30)" },
  { value: "adult", label: "Adult (31-59)" },
  { value: "senior", label: "Senior (60+)" },
];

const MARITAL_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "divorced", label: "Divorced" },
];

export function DetailsForm() {
  const { data, updateData, setStep } = useRegistrationStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleNext() {
    const result = detailsSchema.safeParse({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      ageGroup: data.ageGroup,
      district: data.district,
      occupation: data.occupation,
      maritalStatus: data.maritalStatus,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStep("lookup");
  }

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            error={errors.firstName}
            required
          />
          <Input
            label="Last Name"
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            error={errors.lastName}
            required
          />
        </div>

        <Input
          label="Phone Number"
          value={data.phone}
          onChange={(e) => updateData({ phone: e.target.value })}
          placeholder="+256700000000"
          error={errors.phone}
          required
        />

        <Input
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          placeholder="you@example.com"
          error={errors.email}
        />

        <RadioGroup
          name="gender"
          label="Gender"
          options={GENDER_OPTIONS}
          value={data.gender}
          onChange={(v) => updateData({ gender: v as "male" | "female" })}
          direction="horizontal"
          error={errors.gender}
        />

        <Select
          label="Age Group"
          options={AGE_GROUP_OPTIONS}
          value={data.ageGroup ?? ""}
          onChange={(e) =>
            updateData({
              ageGroup: e.target.value as typeof data.ageGroup,
            })
          }
          placeholder="Select age group"
          error={errors.ageGroup}
        />

        <Input
          label="Location / District"
          value={data.district}
          onChange={(e) => updateData({ district: e.target.value })}
        />

        <Input
          label="Occupation"
          value={data.occupation}
          onChange={(e) => updateData({ occupation: e.target.value })}
        />

        <Select
          label="Marital Status"
          options={MARITAL_OPTIONS}
          value={data.maritalStatus ?? ""}
          onChange={(e) =>
            updateData({
              maritalStatus:
                (e.target.value as typeof data.maritalStatus) || null,
            })
          }
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={() => setStep("event")}>
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
        </Button>
      </div>
    </Card>
  );
}
