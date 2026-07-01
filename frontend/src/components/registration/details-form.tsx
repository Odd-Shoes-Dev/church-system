"use client";

import { useRef, useState } from "react";
import { useRegistrationStore } from "@/lib/registration/store";
import { usePrefetchCache } from "@/lib/registration/prefetch-context";
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
  { value: "child", label: "Child (0–12)" },
  { value: "teen", label: "Teen (13–17)" },
  { value: "young_adult", label: "Young Adult (18–30)" },
  { value: "adult", label: "Adult (31–59)" },
  { value: "senior", label: "Senior (60+)" },
];

const MARITAL_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "divorced", label: "Divorced" },
];

function RequiredStar() {
  return (
    <span className="text-[var(--color-error)] ml-0.5" aria-hidden>*</span>
  );
}

export function DetailsForm() {
  const { data, updateData, setStep } = useRegistrationStore();
  const { prefetchMembers } = usePrefetchCache();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for scroll-to-error
  const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    firstName: useRef(null),
    lastName: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    gender: useRef(null),
    ageGroup: useRef(null),
  };

  function scrollToFirstError(fieldErrors: Record<string, string>) {
    const order = ["firstName", "lastName", "phone", "email", "gender", "ageGroup"];
    for (const field of order) {
      if (fieldErrors[field] && refs[field]?.current) {
        refs[field].current!.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
    }
  }

  function handleNext() {
    const result = detailsSchema.safeParse({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email ?? "",
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
      scrollToFirstError(fieldErrors);
      return;
    }

    setErrors({});
    setStep("lookup");
  }

  return (
    <Card>
      <p className="text-xs text-[var(--color-muted)] mb-4">
        Fields marked <span className="text-[var(--color-error)]">*</span> are required.
      </p>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div ref={refs.firstName}>
            <Input
              label="First Name"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
              error={errors.firstName}
              required
              labelSuffix={<RequiredStar />}
              placeholder="e.g. John"
            />
          </div>
          <div ref={refs.lastName}>
            <Input
              label="Last Name"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
              error={errors.lastName}
              required
              labelSuffix={<RequiredStar />}
              placeholder="e.g. Doe"
            />
          </div>
        </div>

        <div ref={refs.phone}>
          <Input
            label="Phone Number"
            value={data.phone}
            onChange={(e) => {
              updateData({ phone: e.target.value });
              prefetchMembers(e.target.value);
            }}
            placeholder="+256700000000"
            error={errors.phone}
            required
            labelSuffix={<RequiredStar />}
          />
        </div>

        <div ref={refs.email}>
          <Input
            label="Email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="you@example.com (optional)"
            error={errors.email}
          />
        </div>

        <div ref={refs.gender}>
          <RadioGroup
            name="gender"
            label="Gender"
            labelSuffix={<RequiredStar />}
            options={GENDER_OPTIONS}
            value={data.gender}
            onChange={(v) => updateData({ gender: v as "male" | "female" })}
            direction="horizontal"
            error={errors.gender}
          />
        </div>

        <div ref={refs.ageGroup}>
          <Select
            label="Age Group"
            labelSuffix={<RequiredStar />}
            options={AGE_GROUP_OPTIONS}
            value={data.ageGroup ?? ""}
            onChange={(e) =>
              updateData({ ageGroup: e.target.value as typeof data.ageGroup })
            }
            placeholder="Select your age group"
            error={errors.ageGroup}
          />
        </div>

        <Input
          label="Location / District"
          value={data.district}
          onChange={(e) => updateData({ district: e.target.value })}
          placeholder="e.g. Kampala"
        />

        <Input
          label="Occupation"
          value={data.occupation}
          onChange={(e) => updateData({ occupation: e.target.value })}
          placeholder="e.g. Teacher"
        />

        <Select
          label="Marital Status"
          options={MARITAL_OPTIONS}
          value={data.maritalStatus ?? ""}
          onChange={(e) =>
            updateData({
              maritalStatus: (e.target.value as typeof data.maritalStatus) || null,
            })
          }
          placeholder="Select (optional)"
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
