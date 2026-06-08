import { useEffect, useMemo, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../../../../styles/tokens/colors';
import { typography } from '../../../../../styles/tokens/typography';
import { spacing } from '../../../../../styles/tokens/spacing';
import { layout } from '../../../../../styles/tokens/layout';
import { Alert } from '../../../../../components/ds/atoms/Alert';
import { Chip } from '../../../../../components/ds/atoms/Chip';
import { TableNavBar } from '../../../../../components/ds/atoms/Table/TableNavBar';
import { ButtonHint } from '../../../../../components/custom/ButtonHint';
import { ExpandRetractButton } from '../../../../../components/custom/ExpandRetractButton';
import { FiltersModal, copyFilters, filtersEqual } from '@/modules/fila-trabalho/components/FiltersModal';
import { KeywordSearch } from '../../../../../components/custom/KeywordSearch';
import { OrdenacaoDropdown } from '../../../../../components/custom/OrdenacaoDropdown';
import {
  isPresentFilterValue,
  normalizeFilterValue,
  parseSortableValue,
  textIncludesSearch,
} from '../../../../../shared/utils/filterUtils';
import { getTarefasByProcessoId } from '../../../../../domain/processos/tarefas/repositories/tarefas.repository';
import { tarefasToProcessTaskCards } from '../../../../../domain/processos/tarefas/adapters/tarefaToProcessCard.adapter';
import { TAREFA_SITUACAO_LEGEND } from '../../../../../domain/processos/tarefas/config/tarefaSituacao.config';
import { dateInRange } from '../../../../../domain/filtros/dateRange';
import type { FilterState } from '../../../../../domain/filtros/filterModel';
import {
  PROCESSO_TAREFAS_TAB_DATE_RANGE_FIELDS,
  PROCESSO_TAREFAS_TAB_DATE_RANGE_LABELS,
  PROCESSO_TAREFAS_TAB_DATE_RANGE_ROWS,
  PROCESSO_TAREFAS_TAB_FILTER_FIELDS,
  PROCESSO_TAREFAS_TAB_FILTER_LABELS,
  PROCESSO_TAREFAS_TAB_FILTER_ROWS,
  PROCESSO_TAREFAS_TAB_SITUACAO_OPTIONS,
  PROCESSO_TAREFAS_TAB_SORT_FIELDS,
  PROCESSO_TAREFAS_TAB_TOOLBAR,
  PROCESSO_TAREFAS_TAB_GRUPOS,
  PROCESSO_TAREFAS_TAB_DD_COL_COUNT,
} from '../../../../../domain/processos/tarefas/config/processoTarefasTab.config';
import { ProcessTaskCard } from './ProcessTaskCard';

const SITUACAO_LEGEND_UI = {
  finalizada: { icon: CheckCircleIcon, color: colors.success.main },
  em_aberto: { icon: WatchLaterIcon, color: colors.warning.main },
  cancelada: { icon: NotInterestedIcon, color: colors.error.main },
  rejeitada: { icon: CancelIcon, color: colors.error.main },
};

const layoutSpacing = {
  blockGap: layout.blockGap,
  listGap: layout.listGap,
};

function getSituacaoLabel(value: unknown) {
  return PROCESSO_TAREFAS_TAB_SITUACAO_OPTIONS.find(item => item.value === value)?.label ?? value;
}

function getFilterValue(card: Record<string, unknown>, field: Record<string, unknown>) {
  if (field.source === 'situacao') return getSituacaoLabel((card.situacao as string));
  const value = getFieldValue(card, field.fieldId as string);
  return normalizeFilterValue(value, field as Parameters<typeof normalizeFilterValue>[1]);
}

function getFieldValue(card: Record<string, unknown>, fieldId: string): unknown {
  return ((card.fields as Array<Record<string, unknown>>)?.find((field: Record<string, unknown>) => field.fieldId === fieldId) as Record<string, unknown>)?.value ?? '';
}

function createEmptyFilters(): FilterState {
  const filters: FilterState = {};
  PROCESSO_TAREFAS_TAB_FILTER_FIELDS.forEach(field => {
    filters[field.fieldId] = new Set<string>();
  });
  PROCESSO_TAREFAS_TAB_DATE_RANGE_FIELDS.forEach(field => {
    filters[field.fieldId] = { from: null, to: null };
  });
  PROCESSO_TAREFAS_TAB_GRUPOS.forEach(g => {
    filters[g.key] = new Set<string>();
  });
  return filters;
}

function hasSelectedFilters(filters: Record<string, unknown>) {
  return Object.entries(filters).some(([, val]) => {
    if (val instanceof Set) return val.size > 0;
    if (val && typeof val === 'object') return !!((val as Record<string, unknown>).from || (val as Record<string, unknown>).to);
    return false;
  });
}

export function ProcessoTarefasTab({
  processo,
  chipsMap = new Map(),
  possuiFluxo = false,
  onOpenTask,
  getTarefaAssignment,
  isTarefaAtribuida,
  onToggleTaskAssignment,
}: { processo: Record<string, unknown>; chipsMap?: Map<string, unknown[]>; possuiFluxo?: boolean; onOpenTask?: (card: unknown) => void; getTarefaAssignment?: (t: unknown) => unknown; isTarefaAtribuida?: (t: unknown) => boolean; onToggleTaskAssignment?: (t: unknown) => void }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(createEmptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(createEmptyFilters);
  const [keyword, setKeyword] = useState('');
  const [sortField, setSortField] = useState(PROCESSO_TAREFAS_TAB_SORT_FIELDS[0]?.fieldId ?? '');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const cards = useMemo(() => (
    tarefasToProcessTaskCards(getTarefasByProcessoId(processo?.id as string))
  ), [processo?.id]);

  const cardsWithAssignment = useMemo(() => (
    cards.map(card => {
      const assignment = getTarefaAssignment?.(card.id) as Record<string, unknown> | undefined;
      if (!assignment) return card;

      return {
        ...card,
        statusAtribuicao: assignment?.statusAtribuicao,
        tarefa: {
          ...card.tarefa,
          statusAtribuicao: assignment?.statusAtribuicao,
          status: assignment?.statusAtribuicao,
          atribuicao: {
            ...(card.tarefa?.atribuicao ?? {}),
            atribuidoA: assignment?.atribuidoA,
            data: assignment?.data,
          },
        },
        fields: card.fields.map(field => {
          if ((field as unknown as Record<string, unknown>).fieldId === 'atribuidoA') return { ...(field as unknown as Record<string, unknown>), value: assignment?.atribuidoA };
          if ((field as unknown as Record<string, unknown>).fieldId === 'dataAtribuicao') return { ...(field as unknown as Record<string, unknown>), value: assignment?.data };
          return field;
        }),
      };
    })
  ), [cards, getTarefaAssignment]);

  const optionsByField = useMemo(() => (
    PROCESSO_TAREFAS_TAB_FILTER_FIELDS.reduce((acc: Record<string, string[]>, field) => {
      acc[field.fieldId] = [...new Set(
        cardsWithAssignment
          .map((card: Record<string, unknown>) => getFilterValue(card, field as unknown as Record<string, unknown>))
          .filter(isPresentFilterValue)
          .map(v => String(v))
      )].sort((a, b) => a.localeCompare(b, 'pt-BR'));
      return acc;
    }, {} as Record<string, string[]>)
  ), [cardsWithAssignment]);

  const filteredCards = useMemo(() => {
    return cardsWithAssignment.filter(card => {
      const fields = card.fields ?? [];
      const chips = chipsMap.get(card.id as string) ?? (card.chips as unknown[]) ?? [];

      if (hasSelectedFilters(appliedFilters)) {
        const matchesDropdowns = PROCESSO_TAREFAS_TAB_FILTER_FIELDS.every(field => {
          const selected = (appliedFilters as Record<string, unknown>)[field.fieldId];
          if (!selected || (selected as Set<unknown>)?.size === 0) return true;
          return (selected as Set<unknown>)?.has(getFilterValue(card, field as unknown as Record<string, unknown>));
        });
        if (!matchesDropdowns) return false;

        const matchesDates = PROCESSO_TAREFAS_TAB_DATE_RANGE_FIELDS.every(field => {
          const range = appliedFilters[field.fieldId] as { from: string | null; to: string | null } | undefined;
          if (!range?.from && !range?.to) return true;
          return dateInRange(getFieldValue(card, field.fieldId as string) as string, range);
        });
        if (!matchesDates) return false;
      }

      if (keyword.trim()) {
        const matchesKeyword =
          textIncludesSearch(card.taskName, keyword)
          || (fields as Array<Record<string, unknown>>).some((field: Record<string, unknown>) => textIncludesSearch(field.label, keyword) || textIncludesSearch(field.value, keyword))
          || (chips as unknown[]).some((chip: unknown) => textIncludesSearch(typeof chip === 'string' ? chip : (chip as Record<string, unknown>).label, keyword));

        if (!matchesKeyword) return false;
      }

      return true;
    }).sort((a, b) => {
      const aValue = parseSortableValue(getFieldValue(a, sortField));
      const bValue = parseSortableValue(getFieldValue(b, sortField));
      const result = aValue.localeCompare(bValue, 'pt-BR', { numeric: true });
      return sortDirection === 'desc' ? -result : result;
    });
  }, [appliedFilters, cardsWithAssignment, chipsMap, keyword, sortDirection, sortField]);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters, keyword, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));

  useEffect(() => {
    setPage(prev => Math.min(prev, totalPages));
  }, [totalPages]);

  const displayedCards = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCards.slice(start, start + pageSize);
  }, [filteredCards, page, pageSize]);

  const allExpanded = filteredCards.length > 0 && filteredCards.every(card => expandedIds.has(card.id));

  const ordenacaoSections = useMemo(() => [
    {
      title: 'CLASSIFICAR POR',
      items: PROCESSO_TAREFAS_TAB_SORT_FIELDS.map(field => ({
        label: field.label,
        selected: sortField === field.fieldId,
        onClick: () => setSortField(field.fieldId),
      })),
    },
    {
      title: 'ORDENAR POR',
      items: [
        {
          label: 'Crescente',
          selected: sortDirection === 'asc',
          onClick: () => setSortDirection('asc'),
        },
        {
          label: 'Decrescente',
          selected: sortDirection === 'desc',
          onClick: () => setSortDirection('desc'),
        },
      ],
    },
  ], [sortDirection, sortField]);

  const toggleExpanded = (cardId: unknown) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(cardId) ? next.delete(cardId) : next.add(cardId);
      return next;
    });
  };

  const toggleAllExpanded = () => {
    setExpandedIds(prev => {
      if (allExpanded) {
        const next = new Set(prev);
        filteredCards.forEach(card => next.delete(card.id));
        return next;
      }

      const next = new Set(prev);
      filteredCards.forEach(card => next.add(card.id));
      return next;
    });
  };

  const handleClearAppliedFilters = () => {
    setAppliedFilters(createEmptyFilters());
    setPendingFilters(createEmptyFilters());
  };

  const hasAppliedFilters = !filtersEqual(appliedFilters as unknown as Record<string, Set<string> | { from: string | null; to: string | null }>, createEmptyFilters() as unknown as Record<string, Set<string> | { from: string | null; to: string | null }>);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: layoutSpacing.blockGap,
      width: '100%',
      minHeight: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: spacing.sm,
        width: '100%',
        paddingBottom: 4,
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xxs,
          height: 42,
          flex: '1 1 46%',
          minWidth: 260,
          position: 'relative',
        }}>
          <OrdenacaoDropdown sections={ordenacaoSections as unknown as Parameters<typeof OrdenacaoDropdown>[0]["sections"]} hint={PROCESSO_TAREFAS_TAB_TOOLBAR.tooltips.ordenar} />
          <ExpandRetractButton
            expanded={allExpanded}
            active={allExpanded}
            label={PROCESSO_TAREFAS_TAB_TOOLBAR.tooltips.expandirRetrair}
            onClick={toggleAllExpanded}
          />
          <ButtonHint
            icon={<FilterListIcon />}
            hint={PROCESSO_TAREFAS_TAB_TOOLBAR.tooltips.filtros}
            onClick={() => {
              setPendingFilters(copyFilters(appliedFilters as unknown as Record<string, Set<string> | { from: string | null; to: string | null }>));
              setFiltersOpen(true);
            }}
            style={{ opacity: hasAppliedFilters ? 1 : undefined }}
          />
          <KeywordSearch
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder={PROCESSO_TAREFAS_TAB_TOOLBAR.busca.placeholder}
            style={{ flex: '0 1 280px', width: 280, maxWidth: '100%' }}
          />
          {hasAppliedFilters && (
            <button
              type="button"
              onClick={handleClearAppliedFilters}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}
            >
              <Chip color="success" size="sm" trailingIcon={<CloseIcon />} style={{ cursor: 'pointer' }}>
                {filteredCards.length} resultado{filteredCards.length !== 1 ? 's' : ''}
              </Chip>
            </button>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: spacing['bt-3'],
          flex: '1 1 320px',
          minWidth: 260,
          flexWrap: 'wrap',
        }}>
          {TAREFA_SITUACAO_LEGEND.map(item => {
            const ui = SITUACAO_LEGEND_UI[item.key];
            const Icon = ui.icon;
            return (
              <span key={item.key} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xxs }}>
                <Icon style={{ fontSize: 24, color: ui.color }} />
                <span style={{ ...typography.styles.caption, color: colors.surface.dark }}>{item.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {filteredCards.length > 0 && (
        <TableNavBar
          totalRows={filteredCards.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(1);
          }}
          style={{ padding: '2px 0 0', backgroundColor: 'transparent' }}
        />
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: layoutSpacing.listGap,
        width: '100%',
        minHeight: 0,
        padding: `0 ${layout.listShadowGuard} ${layout.listShadowGuard}`,
        boxSizing: 'border-box',
        overflow: 'visible',
      }}>
        {filteredCards.length === 0 ? (
          <Alert
            type="support"
            layout="h"
            message="Nenhuma tarefa encontrada."
            messageStyle={typography.styles.body2}
            style={{ maxWidth: '100%' }}
          />
        ) : (
          displayedCards.map(card => (
            <ProcessTaskCard
              key={card.id}
              card={card}
              chips={chipsMap.get(card.id) ?? card.chips}
              possuiFluxo={possuiFluxo}
              assigned={isTarefaAtribuida?.(card.id) ?? card.statusAtribuicao === 'atribuida'}
              expanded={expandedIds.has(card.id)}
              onToggle={() => toggleExpanded(card.id)}
              onOpenTask={onOpenTask}
              onToggleAssignment={onToggleTaskAssignment}
            />
          ))
        )}
      </div>

      <FiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        pendingFilters={pendingFilters}
        onPendingChange={setPendingFilters}
        onSave={() => {
          setAppliedFilters(copyFilters(pendingFilters as unknown as Record<string, Set<string> | { from: string | null; to: string | null }>));
          setFiltersOpen(false);
        }}
        filterOptions={optionsByField}
        lockedFilters={{}}
        companionGroups={[]}
        grupos={PROCESSO_TAREFAS_TAB_GRUPOS}
        ddRows={PROCESSO_TAREFAS_TAB_FILTER_ROWS}
        ddColCount={PROCESSO_TAREFAS_TAB_DD_COL_COUNT}
        ddLabels={PROCESSO_TAREFAS_TAB_FILTER_LABELS}
        dateRangeRows={PROCESSO_TAREFAS_TAB_DATE_RANGE_ROWS}
        dateRangeLabels={PROCESSO_TAREFAS_TAB_DATE_RANGE_LABELS}
        emptyFiltersFactory={createEmptyFilters}
      />
    </div>
  );
}

