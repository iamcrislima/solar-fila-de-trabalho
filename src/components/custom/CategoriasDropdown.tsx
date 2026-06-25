import { useState, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import LocalOfferIcon    from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon        from '@mui/icons-material/Search';
import { Checkbox }      from '../ds/atoms/Checkbox';
import { DividerH }      from '../ds/atoms/Divider';
import { HintMain }      from '../ds/atoms/Hint/Hint';
import { colors }        from '../../styles/tokens/colors';
import { typography }    from '../../styles/tokens/typography';
import { shadows }       from '../../styles/tokens/shadows';
import { spacing }       from '../../styles/tokens/spacing';
import { borders }       from '../../styles/tokens/borders';
import { TagListItem }   from './TagListItem';

// CategoriasDropdown — Figma: Fila-de-trabalho-SolarBPM node 2251:8277

const CHECKBOX_SLOT_STYLE: CSSProperties = {
  width:          spacing.md,
  height:         spacing.md,
  flex:           `0 0 ${spacing.md}`,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  pointerEvents:  'none',
};

const CATEGORY_TRIGGER_SIZE = 24;
const CATEGORY_DROPDOWN_MIN_WIDTH = 212;
const CATEGORY_DROPDOWN_MAX_WIDTH = 520;

type TagState = 'checked' | 'indeterminate' | 'unchecked';

interface TagItem { label: string; color?: string; iconKey?: string; }

type ChipLike = string | { label: string };

// selectionDisabled: true when no cards are selected — checkbox is visual-only, row is not clickable
function CategoryItem({ item, tagState, onToggle, iconTooltip, selectionDisabled }: { item: TagItem; tagState?: TagState; onToggle?: () => void; iconTooltip?: string; selectionDisabled?: boolean }) {
  return (
    <TagListItem
      label={item.label}
      color={item.color}
      iconKey={item.iconKey}
      iconTooltip={iconTooltip}
      onClick={onToggle}
      disabled={selectionDisabled}
      leading={
        <div style={CHECKBOX_SLOT_STYLE}>
          <Checkbox
            type="solarbpm"
            checked={tagState === 'checked'}
            indeterminate={tagState === 'indeterminate'}
            onChange={() => {}}
          />
        </div>
      }
    />
  );
}

function ActionItem({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding:         spacing.xs,
        cursor:          disabled ? 'default' : 'pointer',
        backgroundColor: !disabled && hovered ? colors.surface.xl : colors.surface.xxxl,
        opacity:         disabled ? 0.4 : 1,
        width:           '100%',
        boxSizing:       'border-box',
      }}
    >
      <span style={{ ...typography.styles.caption, color: colors.surface.dark }}>{label}</span>
    </div>
  );
}

function computeTagStates(items: TagItem[], checkedIds: Set<string>, processChipsMap: Map<string, ChipLike[]>) {
  const states = new Map<string, TagState>();
  for (const item of items) {
    if (checkedIds.size === 0) { states.set(item.label, 'unchecked'); continue; }
    let countWith = 0;
    checkedIds.forEach(id => {
      const chips = processChipsMap.get(id) ?? [];
      if (chips.some(c => (typeof c === 'string' ? c : c.label) === item.label)) countWith++;
    });
    if      (countWith === 0)               states.set(item.label, 'unchecked');
    else if (countWith === checkedIds.size) states.set(item.label, 'checked');
    else                                    states.set(item.label, 'indeterminate');
  }
  return states;
}

// Ações que dependem de seleção de cards
const REQUIRES_SELECTION = new Set(['Aplicar tag']);

export function CategoriasDropdown({
  items           = [],
  iconTooltips    = {},
  acoes           = [],
  checkedIds      = new Set<string>(),
  processChipsMap = new Map<string, ChipLike[]>(),
  onApplyTags,
  onCreateTag,
  onManageTags,
  hint,
  label,
  style,
}: { items?: TagItem[]; iconTooltips?: Record<string, string>; acoes?: string[]; checkedIds?: Set<string>; processChipsMap?: Map<string, ChipLike[]>; onApplyTags?: (tagStates: Map<string, TagState>) => void; onCreateTag?: () => void; onManageTags?: () => void; hint?: string; label?: string; style?: CSSProperties }) {
  const [open,           setOpen]           = useState(false);
  const [showHint,       setShowHint]       = useState(false);
  const [search,         setSearch]         = useState('');
  const [localTagStates, setLocalTagStates] = useState<Map<string, TagState>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const hasSelection = checkedIds.size > 0;
  const hasAnyCheckedTag = [...localTagStates.values()].some(s => s === 'checked');

  // Recompute tag states whenever the dropdown opens
  useEffect(() => {
    if (open) {
      setLocalTagStates(computeTagStates(items, checkedIds, processChipsMap));
    } else {
      setSearch('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggleTag = (label: string) => setLocalTagStates(prev => {
    const next = new Map(prev);
    const cur  = next.get(label) ?? 'unchecked';
    // unchecked → checked; indeterminate → checked; checked → unchecked
    next.set(label, cur === 'checked' ? 'unchecked' : 'checked');
    return next;
  });

  const handleAction = (label: string) => {
    if (label === 'Aplicar tag' && hasSelection && hasAnyCheckedTag) { onApplyTags?.(localTagStates); setOpen(false); }
    else if (label === 'Criar tag pessoal')                          { onCreateTag?.(); setOpen(false); }
    else if (label === 'Gerenciar tags')                             { onManageTags?.(); setOpen(false); }
  };

  const lc = search.toLowerCase();

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', flexShrink: 0, ...style }}>

      {/* Trigger — sempre habilitado */}
      <button
        type="button"
        onMouseEnter={() => setShowHint(true)}
        onMouseLeave={() => setShowHint(false)}
        onClick={() => setOpen(v => !v)}
        style={label ? {
          /* ── Modo toolbar tbtn (com label) ── */
          display:         'flex',
          alignItems:      'center',
          gap:             5,
          height:          30,
          boxSizing:       'border-box',
          padding:         '5px 9px',
          border:          `0.5px solid ${open || showHint ? 'rgba(0,0,0,0.18)' : 'transparent'}`,
          borderRadius:    borders.radius.lg,
          backgroundColor: open || showHint ? colors.surface.xl : 'transparent',
          cursor:          'pointer',
          flexShrink:      0,
          transition:      'background 0.1s, border-color 0.1s, color 0.1s',
          userSelect:      'none',
        } : {
          /* ── Modo ícone (sem label — legado para painéis de detalhe) ── */
          display:         'flex',
          alignItems:      'center',
          gap:             0,
          height:          32,
          boxSizing:       'border-box',
          padding:         `0 ${spacing.xs}`,
          border:          `1px solid ${colors.primary.main}`,
          borderRadius:    borders.radius.md,
          backgroundColor: showHint ? colors.primary.xxl : colors.surface.xxxl,
          opacity:         showHint ? 0.8 : 1,
          cursor:          'pointer',
        }}
      >
        {label ? (
          <>
            <LocalOfferIcon style={{ fontSize: 15, color: open || showHint ? colors.secondary.dark : colors.surface.main, flexShrink: 0 }} />
            <span style={{ ...typography.styles.caption, color: open || showHint ? colors.secondary.dark : colors.secondary.main, whiteSpace: 'nowrap', lineHeight: '20px' }}>
              {label}
            </span>
            <ArrowDropDownIcon style={{ fontSize: 14, color: colors.surface.main, flexShrink: 0, marginLeft: 1 }} />
          </>
        ) : (
          <>
            <LocalOfferIcon style={{ fontSize: CATEGORY_TRIGGER_SIZE, color: colors.primary.main }} />
            <ArrowDropDownIcon style={{ fontSize: CATEGORY_TRIGGER_SIZE, color: colors.primary.main }} />
          </>
        )}
      </button>

      {showHint && hint && !open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 10000, pointerEvents: 'none' }}>
          <HintMain>{hint}</HintMain>
        </div>
      )}

      {open && (
        <div style={{
          position:        'absolute',
          top:             '100%',
          right:           0,
          backgroundColor: colors.surface.xxxl,
          boxShadow:       shadows.level1,
          zIndex:          500,
          width:           'max-content',
          minWidth:        CATEGORY_DROPDOWN_MIN_WIDTH,
          maxWidth:        `min(${CATEGORY_DROPDOWN_MAX_WIDTH}px, calc(100vw - 32px))`,
          boxSizing:       'border-box',
        }}>
          {/* Busca */}
          <div style={{ padding: spacing.xxs }}>
            <div style={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'space-between',
              gap:             spacing.xs,
              border:          `1px solid ${colors.primary.main}`,
              borderRadius:    borders.radius.md,
              padding:         `${spacing.xs} ${spacing['bt-3']} ${spacing.xxs}`,
              backgroundColor: colors.surface.xxxl,
              minHeight:       36,
              boxSizing:       'border-box',
            }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar..."
                style={{
                  ...typography.styles.caption,
                  border:     'none',
                  outline:    'none',
                  background: 'transparent',
                  color:      colors.surface.main,
                  width:      '100%',
                  padding:    0,
                }}
              />
              <SearchIcon style={{ fontSize: CATEGORY_TRIGGER_SIZE, color: colors.surface.main, flexShrink: 0 }} />
            </div>
          </div>

          {/* Itens — sempre no DOM; ocultos via maxHeight para não redimensionar a largura */}
          {items.map((item) => (
            <div
              key={item.label}
              style={lc && !item.label.toLowerCase().includes(lc)
                ? { maxHeight: 0, overflow: 'hidden', padding: 0 }
                : { width: 'max-content', maxWidth: '100%' }
              }
            >
              <CategoryItem
                item={item}
                tagState={localTagStates.get(item.label) ?? 'unchecked'}
                onToggle={() => toggleTag(item.label)}
                iconTooltip={item.iconKey ? iconTooltips[item.iconKey] : undefined}
                selectionDisabled={!hasSelection}
              />
            </div>
          ))}

          {items.length > 0 && <DividerH />}

          {acoes.map(label => (
            <ActionItem
              key={label}
              label={label}
              onClick={() => handleAction(label)}
              disabled={REQUIRES_SELECTION.has(label) && (!hasSelection || !hasAnyCheckedTag)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
