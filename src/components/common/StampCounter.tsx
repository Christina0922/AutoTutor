import { Badge } from '@/components/ui/badge';

interface StampCounterProps {
  stamps: number;
  showButtons?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export function StampCounter({ 
  stamps, 
  showButtons = false,
  onIncrement,
  onDecrement 
}: StampCounterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">도장:</span>
      <Badge variant="secondary" className="font-semibold">
        {stamps}개
      </Badge>
      {showButtons && onIncrement && onDecrement && (
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDecrement();
            }}
            className="h-6 w-6 rounded border border-input bg-background text-xs hover:bg-accent"
            aria-label="도장 차감"
          >
            -1
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIncrement();
            }}
            className="h-6 w-6 rounded border border-input bg-background text-xs hover:bg-accent"
            aria-label="도장 추가"
          >
            +1
          </button>
        </div>
      )}
    </div>
  );
}

