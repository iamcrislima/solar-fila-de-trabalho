import type { CSSProperties } from 'react';
import FilterListIcon    from '@mui/icons-material/FilterList';
import PrintIcon         from '@mui/icons-material/Print';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// FilterResultBar — Figma node: 1381:206687

interface FilterResultBarProps {
  title?: string;
  recordCount?: number;
  recordLabel?: string;
  sortLabel?: string;
  sortValue?: string;
  onFilter?: () => void;
  onSortChange?: () => void;
  onPrint?: () => void;
  style?: CSSProperties;
}

const ICON_BTN: CSSProperties = { border: `1px solid ${colors.surface.main}`, borderRadius: 4, background: 'transparent', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center' };

export function FilterResultBar({ title = 'Resultado da consulta', recordCount, recordLabel, sortLabel = 'Ordenar por:', sortValue = 'Data decrescente', onFilter, onSortChange, onPrint, style }: FilterResultBarProps) {
  const alertText = recordLabel ?? (recordCount !== undefined ? `${recordCount} registros encontrados` : null);
  const CAPTION_BOLD = { ...typography.styles.caption, fontWeight: 700 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 634, borderRadius: 8, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={onFilter} style={ICON_BTN}><FilterListIcon style={{ fontSize: 24, color: colors.surface.main }} /></button>
          <span style={{ ...typography.styles.subtitle1, color: colors.surface.dark }}>{title}</span>
        </div>
      </div>
      {alertText && (
        <div style={{ paddingTop: 8, paddingBottom: 16 }}>
          <div style={{ backgroundColor: colors.surface.xl, borderRadius: 2, padding: '8px 12px' }}>
            <span style={{ ...CAPTION_BOLD, color: colors.surface.dark }}>{alertText}</span>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ ...CAPTION_BOLD, color: colors.surface.dark }}>{sortLabel}</span>
          <button onClick={onSortChange} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
            <span style={{ ...typography.styles.caption, color: colors.surface.main }}>{sortValue}</span>
            <ArrowDropDownIcon style={{ fontSize: 24, color: colors.surface.main }} />
          </button>
        </div>
        <button onClick={onPrint} style={ICON_BTN}><PrintIcon style={{ fontSize: 24, color: colors.surface.main }} /></button>
      </div>
    </div>
  );
}
