import type React from 'react';
import SwapVertIcon    from '@mui/icons-material/SwapVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { colors }     from '../../../../styles/tokens/colors';

// TableHeaderCell — Figma node: 580:38509 (header grid)
// Column header cell. label can be a string (single line) or string[] (up to 3 lines).
// theme: 'default' (#E0E0E0) | 'sub' (#F5F5F5) | 'primary' (#00838F) | 'secondary' (#616161)
// sortDir: 'none' | 'asc' | 'desc'

const BG = {
  default:   colors.surface.light,
  sub:       colors.surface.xl,
  primary:   colors.primary.main,
  secondary: colors.surface.main,
};

const TEXT_COLOR = {
  default:   colors.surface.main,
  sub:       colors.surface.main,
  primary:   colors.surface.xxxl,
  secondary: colors.surface.xxxl,
};

const SortIcon = ({ dir, color }: { dir: string; color: string }) => {
  const style = { fontSize: 16, color, flexShrink: 0 };
  if (dir === 'asc')  return <ArrowUpwardIcon style={style} />;
  if (dir === 'desc') return <ArrowDownwardIcon style={style} />;
  return <SwapVertIcon style={style} />;
};

export function TableHeaderCell({
  label      = 'Label',
  theme      = 'default',
  showR      = false,
  showPercent = false,
  sortable   = false,
  sortDir    = 'none',
  onSort,
  align      = 'left',
  style,
}: { label?: string | string[]; theme?: string; showR?: boolean; showPercent?: boolean; sortable?: boolean; sortDir?: string; onSort?: () => void; align?: string; style?: React.CSSProperties }) {
  const bg     = BG[theme as keyof typeof BG]      ?? BG.default;
  const color  = TEXT_COLOR[theme as keyof typeof TEXT_COLOR] ?? TEXT_COLOR.default;
  const labels = Array.isArray(label) ? label : [label];

  const textStyle = {
    fontFamily:  "'Montserrat', sans-serif",
    fontSize:    12,
    fontWeight:  700,
    color,
    whiteSpace:  'nowrap',
  };

  return (
    <div
      onClick={sortable ? onSort : undefined}
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
        gap:             2,
        backgroundColor: bg,
        borderBottom:    `1px solid ${colors.surface.medium}`,
        paddingLeft:     12,
        paddingRight:    8,
        paddingTop:      8,
        paddingBottom:   8,
        cursor:          sortable ? 'pointer' : 'default',
        boxSizing:       'border-box',
        userSelect:      'none',
        ...style,
      }}
    >
      {/* Label(s) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
        {labels.map((l, i) => (
          <span key={i} style={textStyle}>{i < labels.length - 1 ? `${l}/` : l}</span>
        ))}
      </div>

      {/* (R$) suffix */}
      {showR && (
        <span style={{ ...textStyle, alignSelf: 'flex-end' }}>(R$)</span>
      )}

      {/* (%) suffix */}
      {showPercent && (
        <span style={{ ...textStyle, alignSelf: 'flex-end' }}>(%)</span>
      )}

      {/* Sort icon */}
      {sortable && (
        <SortIcon dir={sortDir} color={color} />
      )}
    </div>
  );
}
