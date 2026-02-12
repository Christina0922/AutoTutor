import { ResultStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: ResultStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const sizeClasses = {
    sm: 'h-5 w-5 text-xs',
    md: 'h-6 w-6 text-sm',
    lg: 'h-8 w-8 text-base',
  };

  const variantMap: Record<ResultStatus, 'success' | 'danger' | 'warning'> = {
    O: 'success',
    X: 'danger',
    '△': 'warning',
  };

  return (
    <Badge
      variant={variantMap[status]}
      className={cn(
        'rounded-full flex items-center justify-center font-bold',
        sizeClasses[size]
      )}
    >
      {status}
    </Badge>
  );
}

