import type { CSSProperties } from 'react';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

type TableAddBarVariant = 'default' | 'surface';

const SCHEME: Record<TableAddBarVariant, { bg: string; color: string }> = {
  default: { bg: colors.primary.xxl,  color: colors.primary.medium },
  surface: { bg: colors.surface.xxl,  color: colors.surface.medium },
};

interface TableAddBarProps { label?: string; variant?: TableAddBarVariant; onAdd?: () => void; style?: CSSProperties; }

export function TableAddBar({ label = 'Add', variant = 'default', onAdd, style }: TableAddBarProps) {
  const scheme = SCHEME[variant] ?? SCHEME.default;
  return (
    <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, width: '100%', height: 40, paddingLeft: 24, paddingRight: 4, paddingTop: 10, paddingBottom: 10, backgroundColor: scheme.bg, border: 'none', cursor: 'pointer', boxSizing: 'border-box', ...style }}>
      <span style={{ ...typography.styles.subtitle2, color: scheme.color, textAlign: 'right' }}>{label}</span>
      <AddCircleOutlinedIcon style={{ fontSize: 24, color: scheme.color }} />
    </button>
  );
}
