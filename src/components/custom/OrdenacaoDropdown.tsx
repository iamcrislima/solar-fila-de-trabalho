import React, { useState, useRef, useEffect } from 'react';
import ImportExportIcon  from '@mui/icons-material/ImportExport';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon   from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon         from '@mui/icons-material/Check';
import { colors }     from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { shadows }    from '../../styles/tokens/shadows';
import { borders }    from '../../styles/tokens/borders';

interface OrdenacaoItem {
  label:      string;
  selecionado?: boolean;
  selected?:    boolean;
  onClick?:   () => void;
  id?:        string;
}

interface OrdenacaoSection {
  titulo?: string;
  title?:  string;
  itens?:  OrdenacaoItem[];
  items?:  OrdenacaoItem[];
}

export function OrdenacaoDropdown({ sections = [], hint, style, variant = 'default' }: {
  sections?: OrdenacaoSection[];
  hint?:     string;
  style?:    React.CSSProperties;
  variant?:  'default' | 'toolbar';
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const firstItems = sections[0]?.itens ?? sections[0]?.items ?? [];
  const selectedItem = firstItems.find(item => item.selecionado || item.selected);
  const selectedLabel = selectedItem?.label ?? hint ?? 'Ordenar';

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const modernTrigger: React.CSSProperties = {
    display:         'flex',
    alignItems:      'center',
    gap:             6,
    padding:         '0 10px',
    height:          32,
    boxSizing:       'border-box',
    border:          `1px solid ${open ? '#0058db' : hovered ? '#9CA3AF' : '#D1D5DB'}`,
    borderRadius:    8,
    backgroundColor: '#fff',
    cursor:          'pointer',
    whiteSpace:      'nowrap',
    transition:      'border-color 0.15s',
    userSelect:      'none',
    minWidth:        110,
  };

  const defaultTrigger: React.CSSProperties = {
    display:         'flex',
    alignItems:      'center',
    gap:             4,
    paddingLeft:     8,
    paddingRight:    4,
    height:          32,
    boxSizing:       'border-box',
    border:          `1px solid ${open ? colors.primary.main : colors.surface.light}`,
    borderRadius:    borders.radius.md,
    backgroundColor: colors.surface.xxxl,
    cursor:          'pointer',
    minWidth:        120,
    transition:      'border-color 0.12s',
    userSelect:      'none',
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', flexShrink: 0, ...style }}
    >
      {/* ── Trigger ── */}
      <div
        role="button"
        tabIndex={0}
        aria-label={hint ?? 'Ordenar'}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v => !v); } }}
        style={variant === 'toolbar' ? modernTrigger : defaultTrigger}
      >
        <ImportExportIcon style={{ fontSize: 15, color: open ? '#0058db' : '#6B7280', flexShrink: 0 }} />

        <span style={{
          ...typography.styles.caption,
          color:        open ? '#0058db' : '#374151',
          flex:         variant === 'default' ? 1 : undefined,
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          lineHeight:   '20px',
          fontWeight:   open ? 600 : 400,
        }}>
          {selectedLabel}
        </span>

        {open
          ? <KeyboardArrowUpIcon   style={{ fontSize: 16, color: open ? '#0058db' : '#9CA3AF', flexShrink: 0 }} />
          : <KeyboardArrowDownIcon style={{ fontSize: 16, color: '#9CA3AF', flexShrink: 0 }} />}
      </div>

      {/* ── Painel dropdown ── */}
      {open && (
        <div style={{
          position:        'absolute',
          top:             'calc(100% + 4px)',
          left:            0,
          backgroundColor: '#fff',
          boxShadow:       shadows.level2 ?? '0 4px 16px rgba(0,0,0,0.12)',
          borderRadius:    10,
          border:          '1px solid #E5E7EB',
          zIndex:          200,
          display:         'flex',
          flexDirection:   'column',
          minWidth:        '100%',
          maxWidth:        'calc(100vw - 16px)',
          overflow:        'hidden',
          padding:         '6px 0',
        }}>
          {sections.map((section, si) => {
            const heading = section.titulo ?? section.title;
            const sectionItems = section.itens ?? section.items ?? [];
            const isLast = si === sections.length - 1;
            return (
              <React.Fragment key={si}>
                {heading && (
                  <div style={{
                    padding:    '4px 12px 2px',
                    fontSize:   10,
                    fontWeight: 600,
                    color:      '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    {heading}
                  </div>
                )}

                {sectionItems.map((item, ii) => {
                  const isSel = item.selecionado || item.selected;
                  return (
                    <ItemRow
                      key={ii}
                      label={item.label}
                      selected={!!isSel}
                      isLast={isLast && ii === sectionItems.length - 1}
                      onClick={() => { item.onClick?.(); setOpen(false); }}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ItemRow({ label, selected, onClick }: { label: string; selected: boolean; isLast?: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             8,
        padding:         '6px 12px',
        width:           '100%',
        boxSizing:       'border-box',
        backgroundColor: selected ? '#edf2ff' : hov ? '#F9FAFB' : '#fff',
        border:          'none',
        cursor:          'pointer',
        textAlign:       'left',
        transition:      'background 0.1s',
      }}
    >
      <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {selected && <CheckIcon style={{ fontSize: 14, color: '#0058db' }} />}
      </div>
      <span style={{ ...typography.styles.caption, color: selected ? '#0058db' : '#374151', whiteSpace: 'nowrap', fontWeight: selected ? 600 : 400 }}>
        {label}
      </span>
    </button>
  );
}
