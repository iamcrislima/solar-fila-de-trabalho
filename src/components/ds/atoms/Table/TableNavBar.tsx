import React, { useEffect, useRef, useState } from 'react';
import FirstPageIcon  from '@mui/icons-material/FirstPage';
import LastPageIcon   from '@mui/icons-material/LastPage';
import ChevronLeftIcon  from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { colors }     from '../../../../styles/tokens/colors';
import { typography } from '../../../../styles/tokens/typography';
import { shadows }    from '../../../../styles/tokens/shadows';

// TableNavBar — Figma node: 586:100526 (Nav Bar Grid)
// Pagination bar. Default variant is active; "Nav Off" (disabled=true) dims the nav controls.
// Left: total record count. Center: rows-per-page selector + range feedback. Right: navigation.

const captionStyle = { ...typography.styles.caption, color: colors.surface.main, whiteSpace: 'nowrap' };

const NavBtn = ({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children?: React.ReactNode }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      border:     'none',
      background: 'transparent',
      cursor:     disabled ? 'default' : 'pointer',
      padding:    0,
      display:    'flex',
      alignItems: 'center',
      color:      colors.surface.main,
    }}
  >
    {children}
  </button>
);

export function TableNavBar({
  totalRows        = 0,
  page             = 1,
  pageSize         = 5,
  pageSizeOptions  = [5, 10, 25, 50],
  onPageChange,
  onPageSizeChange,
  disabled         = false,
  style,
}: { totalRows?: number; page?: number; pageSize?: number; pageSizeOptions?: number[]; onPageChange?: (p: number) => void; onPageSizeChange?: (s: number) => void; disabled?: boolean; style?: React.CSSProperties }) {
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageSizeOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(e.target as Node)) {
        setPageSizeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pageSizeOpen]);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const from       = Math.min((page - 1) * pageSize + 1, totalRows);
  const to         = Math.min(page * pageSize, totalRows);

  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        gap:             8,
        flexWrap:        'wrap',
        backgroundColor: colors.surface.xxxl,
        padding:         '8px 16px',
        boxSizing:       'border-box',
        width:           '100%',
        ...style,
      }}
    >
      {/* Left: record count */}
      <span style={captionStyle}>Qtde. de registros: {totalRows}</span>

      {/* Center: rows per page + range */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flex: '1 1 260px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={captionStyle}>Linhas por página:</span>
          <div ref={pageSizeRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setPageSizeOpen(v => !v)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <span style={captionStyle}>{pageSize}</span>
              <ArrowDropDownIcon style={{ fontSize: 20, color: colors.surface.main, transform: pageSizeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
            {pageSizeOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 200, boxShadow: shadows.level2, backgroundColor: colors.surface.xxxl, minWidth: '100%' }}>
                {pageSizeOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onPageSizeChange?.(opt); setPageSizeOpen(false); }}
                    style={{
                      display:         'block',
                      width:           '100%',
                      padding:         '4px 8px',
                      border:          'none',
                      background:      opt === pageSize ? colors.primary.xxl : 'transparent',
                      cursor:          'pointer',
                      textAlign:       'center',
                      ...captionStyle,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span style={captionStyle}>{from}-{to} de {totalRows}</span>
      </div>

      {/* Right: navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, opacity: disabled ? 0.4 : 1, flex: '0 0 auto' }}>
        <NavBtn onClick={() => onPageChange?.(1)} disabled={disabled || page <= 1}>
          <FirstPageIcon style={{ fontSize: 24 }} />
        </NavBtn>
        <NavBtn onClick={() => onPageChange?.(page - 1)} disabled={disabled || page <= 1}>
          <ChevronLeftIcon style={{ fontSize: 24 }} />
        </NavBtn>
        <span style={captionStyle}>{page}</span>
        <NavBtn onClick={() => onPageChange?.(page + 1)} disabled={disabled || page >= totalPages}>
          <ChevronRightIcon style={{ fontSize: 24 }} />
        </NavBtn>
        <NavBtn onClick={() => onPageChange?.(totalPages)} disabled={disabled || page >= totalPages}>
          <LastPageIcon style={{ fontSize: 24 }} />
        </NavBtn>
      </div>
    </div>
  );
}
