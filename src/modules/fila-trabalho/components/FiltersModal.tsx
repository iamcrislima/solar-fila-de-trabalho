/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties } from 'react';
import { Modal }          from '@/components/ds/atoms/Modal';
import { Button }         from '@/components/ds/atoms/Button/Button';
import { Checkbox }       from '@/components/ds/atoms/Checkbox/Checkbox';
import { FiltroDropdown } from '@/components/app/filters/FiltroDropdown';
import { DateRangeInput } from '@/components/app/filters/DateRangeInput';
import { typography }     from '@/styles/tokens/typography';
import { colors }         from '@/styles/tokens/colors';
import { spacing }        from '@/styles/tokens/spacing';
import { layout }         from '@/styles/tokens/layout';
import { opacity }        from '@/styles/tokens/opacity';
import type { FilterState } from '@/domain/filtros/filterModel';
import type { DateRange }   from '@/domain/filtros/dateRange';

const asSet = (value: unknown): Set<string> =>
  value instanceof Set ? new Set(value as Set<string>) : new Set<string>();

export interface GrupoConfig {
  key: string;
  titulo: string;
  itens: string[];
  autoWidth?: boolean;
}

export interface CompanionGroup {
  key: string;
  titulo: string;
  itens: string[];
}

export const FILTER_MODAL_STYLE: CSSProperties = {
  width:     'min(1024px, calc(100vw - 32px))',
  overflowY: 'auto',
  maxHeight: '90vh',
};

export const FILTER_MODAL_BACKDROP = `rgba(0,0,0,${opacity['level-medium']})`;

export function emptyFilters(): FilterState {
  return {
    tipo: new Set<string>(), natureza: new Set<string>(), encaminhamento: new Set<string>(),
    fluxo: new Set<string>(), tarefas: new Set<string>(), sigilo: new Set<string>(),
    processoDocumento: new Set<string>(), classificacao: new Set<string>(),
    interessado: new Set<string>(), cadastradoPor: new Set<string>(), categoria: new Set<string>(),
    unidadeEncaminhamento: new Set<string>(), unidadeAtual: new Set<string>(),
    recebidoPor: new Set<string>(),
    dataEntrada:          { from: null, to: null },
    dataEncaminhamento:   { from: null, to: null },
    prazoEncaminhamento:  { from: null, to: null },
    recebidoEm:           { from: null, to: null },
  };
}

export { copyFilters, filtersEqual } from '@/domain/filtros/filterModel';

interface CheckboxGroupProps {
  title?: string;
  items?: string[];
  selected?: Set<string>;
  onToggle?: (value: string) => void;
  lockedItems?: Set<string>;
  fill?: boolean;
}

export function CheckboxGroup({
  title,
  items = [],
  selected = new Set(),
  onToggle,
  lockedItems,
  fill = true,
}: CheckboxGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: fill ? '1 0 0' : '0 0 auto', minWidth: fill ? 0 : undefined }}>
      <span style={{
        ...typography.styles.subtitle2,
        color:         colors.secondary.dark,
        height:        spacing.md,
        display:       'flex',
        alignItems:    'center',
        boxSizing:     'border-box',
        paddingBottom: spacing.xxs,
      }}>
        {title}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: layout.blockGap }}>
        {items.map(item => (
          <Checkbox
            key={item}
            type="solarbpm"
            checked={selected.has(item)}
            disabled={lockedItems?.has(item) && selected.has(item)}
            onChange={() => onToggle?.(item)}
          >
            {item}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_DD_LABELS: Record<string, string> = {
  processoDocumento:     'Processo/Documento:',
  interessado:           'Interessado:',
  classificacao:         'Classificação:',
  categoria:             'Categoria:',
  cadastradoPor:         'Cadastrado por:',
  unidadeEncaminhamento: 'Unidade de encaminhamento:',
  unidadeAtual:          'Unidade atual:',
  recebidoPor:           'Usuário de recebimento:',
};

const DEFAULT_DD_ROWS = [
  ['processoDocumento', 'interessado', 'classificacao'],
  ['categoria', 'cadastradoPor', 'unidadeEncaminhamento'],
  ['unidadeAtual', 'recebidoPor'],
];

const DEFAULT_DATE_RANGE_LABELS: Record<string, string> = {
  dataEntrada:         'Data de entrada:',
  dataEncaminhamento:  'Data de encaminhamento:',
  prazoEncaminhamento: 'Prazo de encaminhamento:',
  recebidoEm:          'Data de recebimento:',
};

const DEFAULT_DATE_RANGE_ROWS = [
  ['dataEntrada', 'dataEncaminhamento'],
  ['prazoEncaminhamento', 'recebidoEm'],
];

export function getFilterDropdownItemStyle(ddColCount?: number): CSSProperties {
  if (!ddColCount) return { flex: '1 0 0', minWidth: 0, width: undefined };
  const totalGap = `${(ddColCount - 1) * Number.parseFloat(spacing['bt-3'])}px`;

  return {
    flex:     `0 0 calc((100% - ${totalGap}) / ${ddColCount})`,
    minWidth: 0,
  };
}

function getDateRangeItemStyle(colCount = 2): CSSProperties {
  const totalGap = `${(colCount - 1) * Number.parseFloat(spacing.md)}px`;

  return {
    flex:     `0 1 calc((100% - ${totalGap}) / ${colCount})`,
    minWidth: 0,
  };
}

export function makeFilterDropdownItems(options: string[] | undefined, selectedValue: unknown, lockedValue?: unknown) {
  const selected = asSet(selectedValue);
  const locked = asSet(lockedValue);

  return (options ?? []).map(value => ({
    id:      value,
    label:   value,
    checked: selected.has(value),
    locked:  locked.has(value) && selected.has(value),
  }));
}

interface FilterFieldsContentProps {
  filters: FilterState;
  lockedFilters?: FilterState;
  filterOptions?: Record<string, string[]>;
  grupos?: GrupoConfig[];
  ddRows?: string[][];
  ddLabels?: Record<string, string>;
  ddColCount?: number;
  dateRangeRows?: string[][];
  dateRangeLabels?: Record<string, string>;
  dateRangeColCount?: number;
  companionGroups?: CompanionGroup[];
  onToggleCheckbox: (key: string, value: string) => void;
  onToggleDropdown: (key: string, id: string | number, checked: boolean) => void;
  onToggleDropdownAll: (key: string, ids: Array<string | number>, checked: boolean) => void;
  onDateRangeChange: (key: string, value: DateRange) => void;
}

export function FilterFieldsContent({
  filters,
  lockedFilters,
  filterOptions = {},
  grupos = [],
  ddRows = DEFAULT_DD_ROWS,
  ddLabels = DEFAULT_DD_LABELS,
  ddColCount,
  dateRangeRows = DEFAULT_DATE_RANGE_ROWS,
  dateRangeLabels = DEFAULT_DATE_RANGE_LABELS,
  dateRangeColCount = 2,
  companionGroups,
  onToggleCheckbox,
  onToggleDropdown,
  onToggleDropdownAll,
  onDateRangeChange,
}: FilterFieldsContentProps) {
  const dropdownItemStyle = getFilterDropdownItemStyle(ddColCount);
  const dateRangeItemStyle = getDateRangeItemStyle(dateRangeColCount);
  const hasSingleCheckboxGroup = grupos.length === 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: layout.blockGap }}>
      {grupos.length > 0 && (
        <div style={{
          display:    'flex',
          alignItems: 'flex-start',
          gap:        spacing['bt-3'],
          width:      hasSingleCheckboxGroup ? 'fit-content' : '100%',
          flexWrap:   'wrap',
        }}>
          {grupos.map(group => (
            <CheckboxGroup
              key={group.key}
              title={group.titulo}
              items={group.itens}
              selected={asSet(filters[group.key])}
              onToggle={value => onToggleCheckbox(group.key, value)}
              lockedItems={asSet(lockedFilters?.[group.key])}
              fill={!hasSingleCheckboxGroup && !group.autoWidth}
            />
          ))}
        </div>
      )}

      {ddRows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: layout.blockGap }}>
          {ddRows.map(row => (
            <div key={row.join('|')} style={{ display: 'flex', gap: spacing['bt-3'], flexWrap: 'wrap', width: '100%' }}>
              {row.map(key => (
                <FiltroDropdown
                  key={key}
                  label={ddLabels[key]}
                  items={makeFilterDropdownItems(filterOptions[key], filters[key], lockedFilters?.[key])}
                  onChange={(id, checked) => onToggleDropdown(key, id, checked)}
                  onToggleAll={(ids, checked) => onToggleDropdownAll(key, ids, checked)}
                  style={dropdownItemStyle}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {dateRangeRows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: layout.blockGap }}>
          {dateRangeRows.map((row, rowIndex) => {
            const companion = companionGroups?.[rowIndex];

            return (
              <div
                key={row.join('|')}
                style={{
                  display:    'flex',
                  gap:        spacing.md,
                  flexWrap:   'wrap',
                  alignItems: 'flex-start',
                  width:      '100%',
                }}
              >
                {row.map(key => (
                  <DateRangeInput
                    key={key}
                    label={dateRangeLabels[key]}
                    value={filters[key] as DateRange | undefined}
                    onChange={value => onDateRangeChange(key, value)}
                    disabled={!!((lockedFilters?.[key] as DateRange | undefined)?.from || (lockedFilters?.[key] as DateRange | undefined)?.to)}
                    style={dateRangeItemStyle}
                  />
                ))}
                {companion && (
                  <CheckboxGroup
                    title={companion.titulo}
                    items={companion.itens}
                    selected={asSet(filters[companion.key])}
                    onToggle={value => onToggleCheckbox(companion.key, value)}
                    lockedItems={asSet(lockedFilters?.[companion.key])}
                    fill={false}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface FiltersModalProps {
  open: boolean;
  onClose: () => void;
  pendingFilters: FilterState;
  onPendingChange: (filters: FilterState) => void;
  onSave: () => void;
  lockedFilters?: FilterState;
  filterOptions?: Record<string, string[]>;
  grupos?: GrupoConfig[];
  ddRows?: string[][];
  ddLabels?: Record<string, string>;
  ddColCount?: number;
  dateRangeRows?: string[][];
  dateRangeLabels?: Record<string, string>;
  dateRangeColCount?: number;
  companionGroups?: CompanionGroup[];
  emptyFiltersFactory?: () => FilterState;
}

export function FiltersModal({
  open,
  onClose,
  pendingFilters,
  onPendingChange,
  onSave,
  lockedFilters,
  filterOptions: options = {},
  grupos: gruposProp,
  ddRows: ddRowsProp,
  ddLabels: ddLabelsProp,
  ddColCount,
  dateRangeRows: dateRangeRowsProp,
  dateRangeLabels: dateRangeLabelsProp,
  dateRangeColCount,
  companionGroups,
  emptyFiltersFactory,
}: FiltersModalProps) {
  const effectiveGrupos = gruposProp ?? [];
  const effectiveDdRows = ddRowsProp ?? DEFAULT_DD_ROWS;
  const effectiveDdLabels = ddLabelsProp ?? DEFAULT_DD_LABELS;
  const effectiveDateRangeRows = dateRangeRowsProp ?? DEFAULT_DATE_RANGE_ROWS;
  const effectiveDateRangeLabels = dateRangeLabelsProp ?? DEFAULT_DATE_RANGE_LABELS;
  const clearFilters = emptyFiltersFactory ?? emptyFilters;

  const toggleCb = (key: string, value: string) => {
    if (asSet(lockedFilters?.[key]).has(value)) return;
    const next = asSet(pendingFilters[key]);
    next.has(value) ? next.delete(value) : next.add(value);
    onPendingChange({ ...pendingFilters, [key]: next });
  };

  const toggleDd = (key: string, id: string | number, checked: boolean) => {
    const value = String(id);
    if (!checked && asSet(lockedFilters?.[key]).has(value)) return;
    const next = asSet(pendingFilters[key]);
    checked ? next.add(value) : next.delete(value);
    onPendingChange({ ...pendingFilters, [key]: next });
  };

  const toggleDdAll = (key: string, ids: Array<string | number>, checked: boolean) => {
    const next = asSet(pendingFilters[key]);
    const locked = asSet(lockedFilters?.[key]);

    ids.forEach(rawId => {
      const id = String(rawId);
      if (!checked && locked.has(id)) return;
      checked ? next.add(id) : next.delete(id);
    });

    onPendingChange({ ...pendingFilters, [key]: next });
  };

  const updateDateRange = (key: string, rangeValue: DateRange) => {
    onPendingChange({ ...pendingFilters, [key]: rangeValue });
  };

  const handleClear = () => {
    const empty = clearFilters();

    if (lockedFilters) {
      Object.entries(lockedFilters).forEach(([key, value]) => {
        if (value instanceof Set && value.size > 0) {
          empty[key] = new Set(value as Set<string>);
          return;
        }

        const dateRange = value as DateRange | null | undefined;
        if (dateRange && (dateRange.from || dateRange.to)) {
          empty[key] = { ...dateRange };
        }
      });
    }

    onPendingChange(empty);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Escolha os filtros"
      backdropColor={FILTER_MODAL_BACKDROP}
      footerGap={layout.blockGap}
      style={FILTER_MODAL_STYLE}
      footer={(
        <>
          <Button type="primary" variant="outline" style={{ borderColor: colors.primary.main }} onClick={handleClear}>
            Limpar
          </Button>
          <Button type="primary" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="primary" variant="filled" onClick={onSave}>
            Salvar
          </Button>
        </>
      )}
    >
      <FilterFieldsContent
        filters={pendingFilters}
        lockedFilters={lockedFilters}
        filterOptions={options}
        grupos={effectiveGrupos}
        ddRows={effectiveDdRows}
        ddLabels={effectiveDdLabels}
        ddColCount={ddColCount}
        dateRangeRows={effectiveDateRangeRows}
        dateRangeLabels={effectiveDateRangeLabels}
        dateRangeColCount={dateRangeColCount}
        companionGroups={companionGroups}
        onToggleCheckbox={toggleCb}
        onToggleDropdown={toggleDd}
        onToggleDropdownAll={toggleDdAll}
        onDateRangeChange={updateDateRange}
      />
    </Modal>
  );
}
