import { useState, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon   from '@mui/icons-material/ArrowDropUp';
import SearchIcon        from '@mui/icons-material/Search';
import { Checkbox }       from '../../ds/atoms/Checkbox/Checkbox';
import { TruncatedText }  from '../../ds/atoms/TruncatedText';
import { colorsSolarBPM } from '../../../styles/tokens/solarbpm/colors';
import { colors }         from '../../../styles/tokens/colors';
import { typography }     from '../../../styles/tokens/typography';
import { shadows }        from '../../../styles/tokens/shadows';
import { spacing }        from '../../../styles/tokens/spacing';

// FiltroDropdown — Figma: mQDpB8dWZNnULO7ShaY9Fs node 2361:7947
// Campo que abre um dropdown de checkboxes com busca. Multi-seleção.


const FIELD_BASE: CSSProperties = {
  backgroundColor: colors.surface.xxxl,
  borderRadius:    4,
  display:         'flex',
  alignItems:      'flex-start',
  justifyContent:  'space-between',
  textAlign:       'left',
  paddingLeft:     12,
  paddingRight:    12,
  paddingTop:      8,
  paddingBottom:   10,
  boxSizing:       'border-box',
  width:           '100%',
  cursor:          'pointer',
  border:          'none',
  outline:         'none',
};

const CHECKBOX_SLOT_STYLE: CSSProperties = {
  width:          spacing.md,
  height:         spacing.md,
  flex:           `0 0 ${spacing.md}`,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  pointerEvents:  'none',
};

type SelectAllIconState = 'unchecked' | 'checked' | 'indeterminate';

function SelectAllIcon({ state }: { state: SelectAllIconState }) {
  const selected = state !== 'unchecked';

  return (
    <span
      aria-hidden="true"
      style={{
        width:          spacing.md,
        height:         spacing.md,
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false">
        <rect
          x="4"
          y="8"
          width="12"
          height="12"
          rx="1"
          fill={colors.surface.xxxl}
          stroke={selected ? colors.primary.main : colors.surface.main}
          strokeWidth="2"
        />
        <rect
          x="8"
          y="4"
          width="12"
          height="12"
          rx="1"
          fill={selected ? colors.primary.main : colors.surface.xxxl}
          stroke={selected ? colors.primary.main : colors.surface.main}
          strokeWidth="2"
        />
        {state === 'checked' && (
          <path
            d="M11 10L13 12L17 8"
            stroke={colors.surface.xxxl}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {state === 'indeterminate' && (
          <path
            d="M11 10H17"
            stroke={colors.surface.xxxl}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  );
}

interface SelectAllRowProps {
  allChecked: boolean;
  someChecked: boolean;
  onClick: () => void;
}

function SelectAllRow({ allChecked, someChecked, onClick }: SelectAllRowProps) {
  const [hovered, setHovered] = useState(false);
  const iconState: SelectAllIconState = allChecked ? 'checked' : someChecked ? 'indeterminate' : 'unchecked';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             spacing.xs,
        paddingLeft:     spacing.xs,
        paddingRight:    spacing.xxs,
        paddingTop:      spacing.xxxs,
        paddingBottom:   spacing.xxs,
        backgroundColor: hovered ? colors.surface.xl : colors.surface.xxxl,
        width:           '100%',
        boxSizing:       'border-box',
        cursor:          'pointer',
      }}
    >
      <div style={CHECKBOX_SLOT_STYLE}>
        <SelectAllIcon state={iconState} />
      </div>
      <span style={{ ...typography.styles.body2, color: colors.surface.dark }}>
        Selecionar todos
      </span>
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  locked: boolean;
}

function CheckboxItem({ label, checked, onChange, locked }: CheckboxItemProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => { if (!locked) setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      onClick={locked ? undefined : () => onChange(!checked)}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             spacing.xs,
        paddingLeft:     spacing.xs,
        paddingRight:    spacing.xxs,
        paddingTop:      spacing.xxxs,
        paddingBottom:   spacing.xxs,
        backgroundColor: hovered ? colors.surface.xl : colors.surface.xxxl,
        width:           '100%',
        boxSizing:       'border-box',
        cursor:          locked ? 'not-allowed' : 'pointer',
        opacity:         locked ? 0.45 : 1,
      }}
    >
      <div style={CHECKBOX_SLOT_STYLE}>
        <Checkbox type="solarbpm" checked={checked} onChange={() => {}} />
      </div>
      <TruncatedText text={label} style={{ ...typography.styles.body2, color: colors.surface.dark, flex: 1 }}>
        {label}
      </TruncatedText>
    </div>
  );
}

interface FiltroItem {
  id?: string | number;
  label: string;
  checked?: boolean;
  locked?: boolean;
}

interface FiltroDropdownProps {
  label?: string;
  placeholder?: string;
  items?: FiltroItem[];
  onChange?: (id: string | number, checked: boolean) => void;
  onToggleAll?: (ids: Array<string | number>, select: boolean) => void;
  onSearch?: (term: string) => void;
  style?: CSSProperties;
}

export function FiltroDropdown({
  label        = 'Label*:',
  placeholder  = 'Buscar...',
  items        = [],
  onChange,
  onToggleAll,
  onSearch,
  style,
}: FiltroDropdownProps) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const containerRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filtered = search
    ? items.filter(it => it.label.toLowerCase().includes(search.toLowerCase()))
    : items;

  const selectableFiltered = filtered.filter(it => !it.locked);
  const checkedInFiltered  = selectableFiltered.filter(it => it.checked).length;
  const allChecked  = selectableFiltered.length > 0 && checkedInFiltered === selectableFiltered.length;
  const someChecked = checkedInFiltered > 0 && checkedInFiltered < selectableFiltered.length;

  const handleSelectAll = () => {
    const shouldSelect = !allChecked;
    const filteredIds  = selectableFiltered.map(it => it.id ?? it.label);
    onToggleAll?.(filteredIds, shouldSelect);
  };

  const selectedItems = items.filter(it => it.checked);
  const selectedLabel =
    selectedItems.length === 0 ? '' :
    selectedItems.length === 1 ? selectedItems[0].label :
    'Múltipla seleção';

  const borderColor = open ? colorsSolarBPM.primary.main : colors.surface.medium;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: 396, ...style }}>

      {label && (
        <span style={{ ...typography.styles.body2, color: colors.surface.dark, marginBottom: 2 }}>
          {label}
        </span>
      )}

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => { setOpen(v => !v); if (open) setSearch(''); }}
          style={{ ...FIELD_BASE, border: `1px solid ${borderColor}` }}
        >
          <div style={{ flex: 1, paddingTop: 2, overflow: 'hidden', minWidth: 0 }}>
            {selectedLabel && (
              <TruncatedText text={selectedLabel} style={{ ...typography.styles.body2, color: colors.surface.dark }}>
                {selectedLabel}
              </TruncatedText>
            )}
          </div>
          {open
            ? <ArrowDropUpIcon  style={{ fontSize: 24, color: colors.surface.main, flexShrink: 0 }} />
            : <ArrowDropDownIcon style={{ fontSize: 24, color: colors.surface.main, flexShrink: 0 }} />}
        </button>

        {open && (
          <div style={{
            position:        'absolute',
            top:             'calc(100% + 2px)',
            left:            0,
            right:           0,
            backgroundColor: colors.surface.xxxl,
            boxShadow:       shadows.level2,
            zIndex:          500,
            maxHeight:       240,
            overflowY:       'auto',
          }}>
            {onToggleAll && items.length > 0 && (
              <SelectAllRow
                allChecked={allChecked}
                someChecked={someChecked}
                onClick={handleSelectAll}
              />
            )}
            <div style={{ padding: 4 }}>
              <div style={{
                display:         'flex',
                alignItems:      'flex-start',
                gap:             2,
                border:          `1px solid ${colorsSolarBPM.primary.main}`,
                borderRadius:    4,
                paddingLeft:     12,
                paddingRight:    6,
                paddingTop:      6,
                paddingBottom:   8,
                backgroundColor: colors.surface.xxxl,
                boxSizing:       'border-box',
              }}>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); onSearch?.(e.target.value); }}
                    placeholder={placeholder}
                    style={{
                      ...typography.styles.body2,
                      color:      colors.surface.main,
                      border:     'none',
                      outline:    'none',
                      background: 'transparent',
                      width:      '100%',
                      padding:    0,
                    }}
                  />
                </div>
                <SearchIcon style={{ fontSize: 24, color: colors.surface.main }} />
              </div>
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: '8px 12px' }}>
                <span style={{ ...typography.styles.body2, color: colors.surface.main }}>
                  Nenhuma opção
                </span>
              </div>
            )}
            {filtered.map((item, i) => (
              <CheckboxItem
                key={item.id ?? i}
                label={item.label}
                checked={item.checked ?? false}
                locked={item.locked ?? false}
                onChange={newChecked => onChange?.(item.id ?? i, newChecked)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
