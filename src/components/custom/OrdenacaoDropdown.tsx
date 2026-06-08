import React, { useState, useRef, useEffect } from 'react';
import ImportExportIcon  from '@mui/icons-material/ImportExport';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon   from '@mui/icons-material/ArrowDropUp';
import CheckIcon         from '@mui/icons-material/Check';
import { colors }     from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { shadows }    from '../../styles/tokens/shadows';
import { borders }    from '../../styles/tokens/borders';

// OrdenacaoDropdown — Figma: mQDpB8dWZNnULO7ShaY9Fs node 2361:8082
// Select-style trigger that opens a sectioned ordering dropdown.
// sections: [{ titulo, itens: [{ label, selecionado, onClick }] }]
// The trigger shows the currently selected item from the first section.

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

  // Label visível no trigger = item selecionado da primeira seção
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
        style={variant === 'toolbar' ? {
          /* ── Toolbar tbtn ── */
          display:         'flex',
          alignItems:      'center',
          gap:             5,
          padding:         '5px 9px',
          height:          30,
          boxSizing:       'border-box',
          border:          `0.5px solid ${open || hovered ? 'rgba(0,0,0,0.18)' : 'transparent'}`,
          borderRadius:    borders.radius.lg,
          backgroundColor: open || hovered ? colors.surface.xl : 'transparent',
          cursor:          'pointer',
          whiteSpace:      'nowrap',
          transition:      'background 0.1s, border-color 0.1s, color 0.1s',
          userSelect:      'none',
        } : {
          /* ── Default select ── */
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
        }}
      >
        {/* Ícone */}
        <ImportExportIcon style={{ fontSize: variant === 'toolbar' ? 15 : 16, color: open || hovered ? colors.secondary.dark : colors.surface.main, flexShrink: 0 }} />

        {/* Label */}
        <span style={{
          ...typography.styles.caption,
          color:        open || hovered ? colors.secondary.dark : colors.secondary.main,
          flex:         variant === 'default' ? 1 : undefined,
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          lineHeight:   '20px',
        }}>
          {selectedLabel}
        </span>

        {/* Seta */}
        {open
          ? <ArrowDropUpIcon   style={{ fontSize: variant === 'toolbar' ? 14 : 20, color: colors.surface.main, flexShrink: 0, marginLeft: variant === 'toolbar' ? 1 : 2 }} />
          : <ArrowDropDownIcon style={{ fontSize: variant === 'toolbar' ? 14 : 20, color: colors.surface.main, flexShrink: 0, marginLeft: variant === 'toolbar' ? 1 : 2 }} />}
      </div>

      {/* ── Painel dropdown ── */}
      {open && (
        <div style={{
          position:        'absolute',
          top:             'calc(100% + 4px)',
          left:            0,
          backgroundColor: colors.surface.xxxl,
          boxShadow:       shadows.level1,
          borderRadius:    borders.radius.md,
          zIndex:          200,
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'flex-start',
          minWidth:        '100%',
          maxWidth:        'calc(100vw - 16px)',
          overflowX:       'auto',
        }}>
          {sections.map((section, si) => {
            const isLast  = si === sections.length - 1;
            const heading = section.titulo ?? section.title;
            const sectionItems = section.itens ?? section.items ?? [];
            return (
              <React.Fragment key={si}>
                {/* Cabeçalho da seção */}
                {heading && (
                  <div style={{
                    display:         'flex',
                    alignItems:      'center',
                    paddingLeft:     8,
                    paddingRight:    40,
                    paddingTop:      si === 0 ? 8 : 4,
                    paddingBottom:   4,
                    width:           '100%',
                    boxSizing:       'border-box',
                    backgroundColor: colors.surface.xxxl,
                  }}>
                    <span style={{ ...typography.styles.topIcon, color: colors.surface.dark, whiteSpace: 'nowrap' }}>
                      {heading}
                    </span>
                  </div>
                )}

                {/* Itens da seção */}
                {sectionItems.map((item, ii) => {
                  const isLastItem = isLast && ii === sectionItems.length - 1;
                  const isSel      = item.selecionado || item.selected;
                  return (
                    <button
                      key={ii}
                      onClick={() => { item.onClick?.(); setOpen(false); }}
                      style={{
                        display:         'flex',
                        alignItems:      'center',
                        gap:             8,
                        paddingLeft:     8,
                        paddingRight:    8,
                        paddingTop:      4,
                        paddingBottom:   isLastItem ? 8 : 4,
                        width:           '100%',
                        boxSizing:       'border-box',
                        backgroundColor: colors.surface.xxxl,
                        border:          'none',
                        cursor:          'pointer',
                        textAlign:       'left',
                      }}
                    >
                      {/* Slot de 16 px para o checkmark — sempre reserva espaço */}
                      <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isSel && <CheckIcon style={{ fontSize: 16, color: colors.surface.dark }} />}
                      </div>
                      <span style={{ ...typography.styles.caption, color: colors.surface.dark, whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                    </button>
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
