import { clsx } from "clsx";

type BadgeVariant = "default" | "success" | "warning" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  success:
    "bg-green-900/10 text-green-900",
  warning:
    "bg-amber-900/10 text-amber-900",
  muted:
    "bg-[var(--color-surface)] text-[var(--color-muted)]",
};

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 text-xs font-[var(--font-body)] rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
