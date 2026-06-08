import type { CSSProperties } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// FilterNavBar — Figma node: 592:90826

interface FilterNavBarProps {
  pageSize?: number;
  onPageSizeChange?: () => void;
  sortValue?: string;
  onSortChange?: () => void;
  page?: number;
  totalRows?: number;
  style?: CSSProperties;
}

export function FilterNavBar({ pageSize = 10, onPageSizeChange, sortValue = 'Mais relevantes', onSortChange, page = 1, totalRows = 10, style }: FilterNavBarProps) {
  const from  = Math.min((page - 1) * pageSize + 1, totalRows);
  const to    = Math.min(page * pageSize, totalRows);
  const range = `${from}-${to} de ${totalRows}`;
  const CAPTION = typography.styles.caption;
  const CAPTION_BOLD = { ...CAPTION, fontWeight: 700 };
  const dropBtn = (onClick?: () => void): CSSProperties => ({ display: 'flex', alignItems: 'center', border: 'none', background: 'transparent', cursor: onClick ? 'pointer' : 'default', padding: 0, gap: 2 });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', maxWidth: 1072, boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ ...CAPTION, color: colors.surface.main }}>Linhas por página:</span>
        <button onClick={onPageSizeChange} style={dropBtn(onPageSizeChange)}>
          <span style={{ ...CAPTION, color: colors.surface.main }}>{pageSize}</span>
          <ArrowDropDownIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ ...CAPTION_BOLD, color: colors.surface.main }}>Ordenar por</span>
        <button onClick={onSortChange} style={dropBtn(onSortChange)}>
          <span style={{ ...CAPTION, color: colors.surface.main }}>{sortValue}</span>
          <ArrowDropDownIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </button>
      </div>
      <span style={{ ...CAPTION, color: colors.surface.main }}>Qtde de registros: {range}</span>
    </div>
  );
}
