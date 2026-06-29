import { clsx } from "clsx";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className={clsx("w-full", className)}>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-[var(--font-body)] text-[var(--color-muted)]">
          Step {current} of {total}
        </span>
        <span className="text-xs font-[var(--font-body)] text-[var(--color-muted)]">
          {percent}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
