import { ResultStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: ResultStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const cls =
    status === "O"
      ? "bg-success text-success-foreground"
      : status === "X"
      ? "bg-danger text-danger-foreground"
      : "bg-warning text-warning-foreground";

  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-semibold",
      cls,
      sizeClasses[size]
    )}>
      {status}
    </span>
  );
}
