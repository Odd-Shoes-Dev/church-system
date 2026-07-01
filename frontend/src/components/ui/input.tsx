import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelSuffix?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelSuffix, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-[var(--font-body)] text-[var(--color-text)]"
          >
            {label}{labelSuffix}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full px-3 py-2 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] font-[var(--font-body)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all",
            error && "border-[var(--color-error)]",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-sm text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
