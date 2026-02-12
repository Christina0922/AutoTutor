import { ResultStatus } from '../types';

interface OXBadgeProps {
  status: ResultStatus;
  size?: 'small' | 'medium' | 'large';
}

export function OXBadge({ status, size = 'medium' }: OXBadgeProps) {
  const sizeMap = {
    small: { width: '24px', height: '24px', fontSize: '12px' },
    medium: { width: '32px', height: '32px', fontSize: '16px' },
    large: { width: '40px', height: '40px', fontSize: '20px' },
  };

  const style = sizeMap[size];
  const colorMap = {
    O: { bg: '#4caf50', color: 'white' },
    X: { bg: '#f44336', color: 'white' },
    '△': { bg: '#ff9800', color: 'white' },
  };

  const colors = colorMap[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: style.width,
        height: style.height,
        borderRadius: '50%',
        backgroundColor: colors.bg,
        color: colors.color,
        fontSize: style.fontSize,
        fontWeight: 700,
      }}
    >
      {status}
    </span>
  );
}

