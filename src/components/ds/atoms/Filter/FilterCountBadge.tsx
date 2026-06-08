import type { CSSProperties } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

interface FilterCountBadgeProps { count?: number | string; style?: CSSProperties; }

export function FilterCountBadge({ count, style }: FilterCountBadgeProps) {
  return (
    <div style={{ backgroundColor: colors.surface.main, borderRadius: 492, padding: '1px 3px 2px 2px', display: 'flex', alignItems: 'center', flexShrink: 0, ...style }}>
      <span style={{ ...typography.styles.topIcon, color: colors.surface.xxxl }}>{count}</span>
    </div>
  );
}
