import React, { useState, useRef, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon   from '@mui/icons-material/KeyboardArrowUp';
import AddCircleOutlineIcon  from '@mui/icons-material/AddCircleOutlined';
import EditOutlinedIcon      from '@mui/icons-material/EditOutlined';
import ViewListIcon          from '@mui/icons-material/ViewList';
import CheckIcon             from '@mui/icons-material/Check';
import { TruncatedText }     from '../ds/atoms/TruncatedText';
import { colors }     from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { shadows }    from '../../styles/tokens/shadows';

interface VisualizacaoDropdownProps {
  value?: string;
  options?: Array<{ label: string; id?: string }>;
  onCreateCustom?: () => void;
  myViews?: Array<{ id?: string; label: string }>;
  onEditView?: (id: string) => void;
  onChange?: (value: string) => void;
  style?: unknown;
  variant?: 'default' | 'toolbar';
}

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
  const select = (item: string | { label: string; id?: string }) => { onChange?.(typeof item === 'string' ? item : (item.label ?? '')); setOpen(false); };
  const isSelected = (item: { label: string; id?: string }): boolean => item.label === value;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeView = myViews.find(v => v.label === value);
    if (activeView) onEditView?.(activeView?.id ?? activeView?.label ?? '');
  };

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
    minWidth:        100,
  };

  const defaultTrigger: React.CSSProperties = {
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
        style={variant === 'toolbar' ? modernTrigger : defaultTrigger}
      >
        {variant === 'toolbar' ? (
          <>
            <ViewListIcon style={{ fontSize: 15, color: open ? '#0058db' : '#6B7280', flexShrink: 0 }} />
            <span style={{ ...typography.styles.caption, color: open ? '#0058db' : '#374151', whiteSpace: 'nowrap', lineHeight: '20px', fontWeight: open ? 600 : 400 }}>
              {value}
            </span>
            {open
              ? <KeyboardArrowUpIcon   style={{ fontSize: 16, color: open ? '#0058db' : '#9CA3AF', flexShrink: 0 }} />
              : <KeyboardArrowDownIcon style={{ fontSize: 16, color: '#9CA3AF', flexShrink: 0 }} />}
          </>
        ) : (
          <>
            <TruncatedText text={value} style={{ ...typography.styles.body2, color: colors.surface.dark, flex: 1, textAlign: 'left' }}>
              {value}
            </TruncatedText>
            {open
              ? <KeyboardArrowUpIcon   style={{ fontSize: 20, color: colors.surface.main, flexShrink: 0 }} />
              : <KeyboardArrowDownIcon style={{ fontSize: 20, color: colors.surface.main, flexShrink: 0 }} />}
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
          top:             'calc(100% + 4px)',
          left:            0,
          minWidth:        '100%',
          backgroundColor: '#fff',
          boxShadow:       shadows.level2 ?? '0 4px 16px rgba(0,0,0,0.12)',
          borderRadius:    10,
          border:          '1px solid #E5E7EB',
          zIndex:          100,
          display:         'flex',
          flexDirection:   'column',
          maxWidth:        'calc(100vw - 16px)',
          overflow:        'hidden',
          padding:         '6px 0',
        }}>
          {/* Static options */}
          {options.map((item) => (
            <VisualizacaoItem
              key={item.id ?? item.label}
              label={item.label}
              selected={isSelected(item)}
              onClick={() => select(item)}
            />
          ))}

          {/* Create custom view */}
          <button
            type="button"
            onClick={onCreateCustom}
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             8,
              padding:         '6px 12px',
              width:           '100%',
              boxSizing:       'border-box',
              background:      'none',
              border:          'none',
              cursor:          'pointer',
              textAlign:       'left',
            }}
          >
            <AddCircleOutlineIcon style={{ fontSize: 16, color: '#6B7280', flexShrink: 0 }} />
            <span style={{ ...typography.styles.caption, color: '#374151' }}>
              Criar visualização personalizada
            </span>
          </button>

          {/* Custom views */}
          {myViews.length > 0 && (
            <>
              <div style={{ height: 1, backgroundColor: '#F3F4F6', margin: '4px 0' }} />
              <div style={{ padding: '2px 12px 4px', fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Minhas visualizações
              </div>
              {myViews.map((item) => (
                <VisualizacaoItem
                  key={item.id ?? item.label}
                  label={item.label}
                  selected={isSelected(item)}
                  onClick={() => select(item)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function VisualizacaoItem({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
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
