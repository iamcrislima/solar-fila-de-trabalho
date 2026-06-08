import type { CSSProperties } from 'react';
import ArrowDropDownOutlined from '@mui/icons-material/ArrowDropDownOutlined';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

interface InputOrderingProps { label?: string; value?: string; onClick?: () => void; style?: CSSProperties; }

export function InputOrdering({ label = 'Ordenar por:', value = '', onClick, style }: InputOrderingProps) {
  return (
    <div onClick={onClick} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 49, cursor: onClick ? 'pointer' : 'default', ...style }}>
      <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, lineHeight: '16px', color: colors.surface.dark, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.regular, color: colors.surface.main, whiteSpace: 'nowrap' }}>{value}</span>
        <ArrowDropDownOutlined style={{ fontSize: 24, color: colors.surface.medium }} />
      </div>
    </div>
  );
}
