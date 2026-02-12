interface StampCounterProps {
  stamps: number;
}

export function StampCounter({ stamps }: StampCounterProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ color: 'var(--text-secondary)' }}>도장: </span>
      <span style={{ fontWeight: 600, color: '#ffc107' }}>{stamps}개</span>
    </div>
  );
}

