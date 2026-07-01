"use client";

import { clsx } from "clsx";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  labelSuffix?: React.ReactNode;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  direction?: "horizontal" | "vertical";
}

export function RadioGroup({
  name,
  label,
  labelSuffix,
  options,
  value,
  onChange,
  error,
  direction = "vertical",
}: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      {label && (
        <legend className="text-sm font-[var(--font-body)] text-[var(--color-text)] mb-1">
          {label}{labelSuffix}
        </legend>
      )}
      <div
        className={clsx(
          "flex gap-3",
          direction === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] border cursor-pointer transition-all",
              value === opt.value
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                : "border-[var(--color-border)] hover:border-[var(--color-secondary)]"
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-[var(--color-primary)]"
            />
            <span className="font-[var(--font-body)] text-[var(--color-text)]">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      {error && <span className="text-sm text-[var(--color-error)]">{error}</span>}
    </fieldset>
  );
}
