import React, { useState, useRef, useEffect } from 'react';
import ArrowDropDownIcon    from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon      from '@mui/icons-material/ArrowDropUp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import EditOutlinedIcon     from '@mui/icons-material/EditOutlined';
import ViewListIcon         from '@mui/icons-material/ViewList';
import { DropdownMenuItem } from '../ds/atoms/DropdownMenu';
import { TruncatedText }    from '../ds/atoms/TruncatedText';
import { colors }     from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { shadows }    from '../../styles/tokens/shadows';
import { borders }    from '../../styles/tokens/borders';

// VisualizacaoDropdown — Figma: mQDpB8dWZNnULO7ShaY9Fs node 2361:8355 / 2120:6906
// Edit icon appears inside the trigger field when a custom view is selected.
// Dropdown list items have no edit button — uniform DropdownMenuItem style.

const ITEM_ROW = {
  display:         'flex',
  alignItems:      'center',
  gap:             8,
  paddingLeft:     8,
  paddingRight:    4,
  paddingTop:      4,
  paddingBottom:   4,
  height:          30,
  width:           '100%',
  boxSizing:       'border-box',
  backgroundColor: colors.surface.xxxl,
  border:          'none',
  cursor:          'pointer',
  textAlign:       'left',
};

interface VisualizacaoDropdownProps { value?: string; options?: Array<{ label: string; id?: string }>; onCreateCustom?: () => void; myViews?: Array<{ id?: string; label: string }>; onEditView?: (id: string) => void; onChange?: (value: string) => void; style?: unknown; variant?: 'default' | 'toolbar'; }
export function VisualizacaoDropdown({
  value         = 'Visualização padrão',
  options       = [],
  onCreateCustom,
  myViews       = [],
  onEditView,
  onChange,
  style,
  variant       = 'default',
}: VisualizacaoDropdownProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isCustomViewActive = myViews.some(v => v.label === value);
  const select = (item: string | { label: string; id?: string }) => { onChange?.(typeof item === "string" ? item : (item.label ?? "")); setOpen(false); };
  const isSelected = (item: { label: string; id?: string }): boolean => item.label === value;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeView = myViews.find(v => v.label === value);
    if (activeView) onEditView?.(activeView?.id ?? activeView?.label ?? "");
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', ...(variant === 'toolbar' ? { flexShrink: 0 } : { width: '100%' }), ...(style as object) }}>

      {/* Trigger */}
      <div
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}
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
          paddingLeft:     12,
          paddingRight:    8,
          height:          32,
          border:          `1px solid ${colors.surface.medium}`,
          borderRadius:    4,
          backgroundColor: colors.surface.xxxl,
          cursor:          'pointer',
          width:           '100%',
          boxSizing:       'border-box',
          gap:             6,
        }}
      >
        {variant === 'toolbar' ? (
          /* ── Toolbar: ícone + label + seta ── */
          <>
            <ViewListIcon style={{ fontSize: 15, color: open || hovered ? colors.secondary.dark : colors.surface.main, flexShrink: 0 }} />
            <span style={{ ...typography.styles.caption, color: open || hovered ? colors.secondary.dark : colors.secondary.main, whiteSpace: 'nowrap', lineHeight: '20px' }}>
              Visualização
            </span>
            {open
              ? <ArrowDropUpIcon   style={{ fontSize: 14, color: colors.surface.main, flexShrink: 0, marginLeft: 1 }} />
              : <ArrowDropDownIcon style={{ fontSize: 14, color: colors.surface.main, flexShrink: 0, marginLeft: 1 }} />}
          </>
        ) : (
          /* ── Default: texto do valor selecionado ── */
          <>
            <TruncatedText text={value} style={{ ...typography.styles.body2, color: colors.surface.dark, flex: 1, textAlign: 'left' }}>
              {value}
            </TruncatedText>
            {open
              ? <ArrowDropUpIcon   style={{ fontSize: 20, color: colors.surface.main, flexShrink: 0 }} />
              : <ArrowDropDownIcon style={{ fontSize: 20, color: colors.surface.main, flexShrink: 0 }} />}
            {isCustomViewActive && (
              <button
                type="button"
                onClick={handleEditClick}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}
              >
                <EditOutlinedIcon style={{ fontSize: 24, color: colors.surface.main }} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position:        'absolute',
          top:             '100%',
          left:            0,
          minWidth:        '100%',
          backgroundColor: colors.surface.xxxl,
          boxShadow:       shadows.level2,
          zIndex:          100,
          display:         'flex',
          flexDirection:   'column',
          maxWidth:        'calc(100vw - 16px)',
          overflowX:       'auto',
        }}>
          {/* Static options */}
          {options.map((item) => (
            <DropdownMenuItem
              key={item.id ?? item.label}
              label={item.label}
              active={isSelected(item)}
              onClick={() => select(item)}
              style={{ minWidth: '100%' }}
            />
          ))}

          {/* Create custom view */}
          <div style={{ ...(ITEM_ROW as object), cursor: 'pointer' }} onClick={onCreateCustom}>
            <AddCircleOutlineIcon style={{ fontSize: 24, color: colors.surface.dark, flexShrink: 0 }} />
            <TruncatedText text="Criar visualização personalizada" style={{ ...typography.styles.caption, color: colors.surface.dark, flex: 1 }}>
              Criar visualização personalizada
            </TruncatedText>
          </div>

          {/* Custom views — same DropdownMenuItem style, no edit button in list */}
          {myViews.length > 0 && (
            <>
              <div style={{ ...(ITEM_ROW as object), cursor: 'default' }}>
                <span style={{ ...typography.styles.topIcon, color: colors.surface.dark }}>
                  Minhas visualizações
                </span>
              </div>
              {myViews.map((item) => (
                <DropdownMenuItem
                  key={item.id ?? item.label}
                  label={item.label}
                  active={isSelected(item)}
                  onClick={() => select(item)}
                  style={{ minWidth: '100%' }}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
