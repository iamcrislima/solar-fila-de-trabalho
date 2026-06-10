import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CancelIcon from '@mui/icons-material/Cancel';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ViewListIcon from '@mui/icons-material/ViewList';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import CheckIcon from '@mui/icons-material/Check';
import { colors } from '../../../../../styles/tokens/colors';
import { FiltersModal, copyFilters, filtersEqual } from '@/modules/fila-trabalho/components/FiltersModal';
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

// ─── Legend config ────────────────────────────────────────────────────────────

const LEGEND_UI: Record<string, {
  Icon: React.ElementType;
  bg: string;
  color: string;
}> = {
  finalizada: { Icon: CheckCircleIcon, bg: '#DCFCE7', color: '#15803D' },
  em_aberto:  { Icon: WatchLaterIcon,  bg: '#FFF7ED', color: '#C2410C' },
  cancelada:  { Icon: NotInterestedIcon, bg: '#F3F4F6', color: '#9CA3AF' },
  rejeitada:  { Icon: CancelIcon,      bg: '#FEF2F2', color: '#DC2626' },
};

// ─── Helper components ────────────────────────────────────────────────────────

function ToolbarIconBtn({
  title,
  active,
  onClick,
  children,
}: {
  title?: string;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30,
        height: 30,
        border: active
          ? `1px solid ${colors.primary.main}`
          : `1px solid ${hovered ? '#9CA3AF' : '#D1D5DB'}`,
        background: active ? '#EFF6FF' : hovered ? '#F3F4F6' : '#fff',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: active ? colors.primary.main : '#6B7280',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        padding: 0,
        flexShrink: 0,
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

function SearchInputWidget({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #D1D5DB',
        borderRadius: 6,
        overflow: 'hidden',
        height: 30,
        flexShrink: 0,
      }}
    >
      <input
        type="text"
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder ?? 'Palavra-chave'}
        style={{
          border: 'none',
          outline: 'none',
          padding: '0 10px',
          fontSize: 12,
          color: '#374151',
          width: 160,
          background: '#fff',
          fontFamily: 'inherit',
        }}
      />
      <button
        type="button"
        style={{
          border: 'none',
          background: 'transparent',
          padding: '0 8px',
          cursor: 'pointer',
          color: '#9CA3AF',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SearchIcon style={{ fontSize: 15 }} />
      </button>
    </div>
  );
}

function SortMenu({
  sections,
  onClose,
}: {
  sections: { title?: string; items: { label: string; selected?: boolean; onClick?: () => void }[] }[];
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 34,
        left: 0,
        zIndex: 1000,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        padding: '6px 0',
        minWidth: 170,
      }}
    >
      {sections.map((section, si) => (
        <div key={si}>
          {section.title && (
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                padding: '4px 12px 2px',
                margin: 0,
              }}
            >
              {section.title}
            </p>
          )}
          {section.items.map((item, ii) => (
            <button
              key={ii}
              type="button"
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '5px 12px',
                border: 'none',
                background: item.selected ? '#EFF6FF' : 'transparent',
                color: item.selected ? colors.primary.main : '#374151',
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ width: 14, display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                {item.selected && <CheckIcon style={{ fontSize: 13 }} />}
              </span>
              {item.label}
            </button>
          ))}
          {si < sections.length - 1 && (
            <div style={{ height: 1, background: '#F3F4F6', margin: '4px 0' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function PageBtn({
  title,
  active,
  onClick,
  disabled,
  children,
}: {
  title?: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        border: active ? `1px solid ${colors.primary.main}` : '1px solid #E5E7EB',
        background: active ? colors.primary.main : hovered ? '#F3F4F6' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: active ? '#fff' : '#6B7280',
        fontSize: 11,
        fontWeight: active ? 600 : 400,
        opacity: disabled ? 0.4 : 1,
        padding: 0,
        fontFamily: 'inherit',
        transition: 'background 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// ─── Logic helpers ────────────────────────────────────────────────────────────

function getSituacaoLabel(value: unknown) {
  return PROCESSO_TAREFAS_TAB_SITUACAO_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

function getFilterValue(card: Record<string, unknown>, field: Record<string, unknown>) {
  if (field.source === 'situacao') return getSituacaoLabel(card.situacao as string);
  const value = getFieldValue(card, field.fieldId as string);
  return normalizeFilterValue(value, field as Parameters<typeof normalizeFilterValue>[1]);
}

function getFieldValue(card: Record<string, unknown>, fieldId: string): unknown {
  return (
    (card.fields as Array<Record<string, unknown>>)?.find(
      (field: Record<string, unknown>) => field.fieldId === fieldId
    ) as Record<string, unknown>
  )?.value ?? '';
}

function createEmptyFilters(): FilterState {
  const filters: FilterState = {};
  PROCESSO_TAREFAS_TAB_FILTER_FIELDS.forEach((field) => {
    filters[field.fieldId] = new Set<string>();
  });
  PROCESSO_TAREFAS_TAB_DATE_RANGE_FIELDS.forEach((field) => {
    filters[field.fieldId] = { from: null, to: null };
  });
  PROCESSO_TAREFAS_TAB_GRUPOS.forEach((g) => {
    filters[g.key] = new Set<string>();
  });
  return filters;
}

function hasSelectedFilters(filters: Record<string, unknown>) {
  return Object.entries(filters).some(([, val]) => {
    if (val instanceof Set) return val.size > 0;
    if (val && typeof val === 'object')
      return !!(
        (val as Record<string, unknown>).from || (val as Record<string, unknown>).to
      );
    return false;
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProcessoTarefasTab({
  processo,
  chipsMap = new Map(),
  possuiFluxo = false,
  onOpenTask,
  getTarefaAssignment,
  isTarefaAtribuida,
  onToggleTaskAssignment,
}: {
  processo: Record<string, unknown>;
  chipsMap?: Map<string, unknown[]>;
  possuiFluxo?: boolean;
  onOpenTask?: (card: unknown) => void;
  getTarefaAssignment?: (t: unknown) => unknown;
  isTarefaAtribuida?: (t: unknown) => boolean;
  onToggleTaskAssignment?: (t: unknown) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(createEmptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(createEmptyFilters);
  const [keyword, setKeyword] = useState('');
  const [sortField, setSortField] = useState(PROCESSO_TAREFAS_TAB_SORT_FIELDS[0]?.fieldId ?? '');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedIds, setExpandedIds] = useState(new Set<unknown>());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sortOpen]);

  const cards = useMemo(
    () => tarefasToProcessTaskCards(getTarefasByProcessoId(processo?.id as string)),
    [processo?.id]
  );

  const cardsWithAssignment = useMemo(
    () =>
      cards.map((card) => {
        const assignment = getTarefaAssignment?.(card.id) as
          | Record<string, unknown>
          | undefined;
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
          fields: card.fields.map((field) => {
            const f = field as unknown as Record<string, unknown>;
            if (f.fieldId === 'atribuidoA') return { ...f, value: assignment?.atribuidoA };
            if (f.fieldId === 'dataAtribuicao') return { ...f, value: assignment?.data };
            return field;
          }),
        };
      }),
    [cards, getTarefaAssignment]
  );

  const optionsByField = useMemo(
    () =>
      PROCESSO_TAREFAS_TAB_FILTER_FIELDS.reduce(
        (acc: Record<string, string[]>, field) => {
          acc[field.fieldId] = [
            ...new Set(
              cardsWithAssignment
                .map((card: Record<string, unknown>) =>
                  getFilterValue(card, field as unknown as Record<string, unknown>)
                )
                .filter(isPresentFilterValue)
                .map((v) => String(v))
            ),
          ].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          return acc;
        },
        {} as Record<string, string[]>
      ),
    [cardsWithAssignment]
  );

  const filteredCards = useMemo(() => {
    return cardsWithAssignment
      .filter((card) => {
        const fields = card.fields ?? [];
        const chips =
          chipsMap.get(card.id as string) ??
          (card.chips as unknown[]) ??
          [];

        if (hasSelectedFilters(appliedFilters)) {
          const matchesDropdowns = PROCESSO_TAREFAS_TAB_FILTER_FIELDS.every(
            (field) => {
              const selected = (appliedFilters as Record<string, unknown>)[
                field.fieldId
              ];
              if (!selected || (selected as Set<unknown>)?.size === 0) return true;
              return (selected as Set<unknown>)?.has(
                getFilterValue(card, field as unknown as Record<string, unknown>)
              );
            }
          );
          if (!matchesDropdowns) return false;

          const matchesDates = PROCESSO_TAREFAS_TAB_DATE_RANGE_FIELDS.every(
            (field) => {
              const range = appliedFilters[field.fieldId] as
                | { from: string | null; to: string | null }
                | undefined;
              if (!range?.from && !range?.to) return true;
              return dateInRange(
                getFieldValue(card, field.fieldId as string) as string,
                range
              );
            }
          );
          if (!matchesDates) return false;
        }

        if (keyword.trim()) {
          const matchesKeyword =
            textIncludesSearch(card.taskName, keyword) ||
            (fields as Array<Record<string, unknown>>).some(
              (field: Record<string, unknown>) =>
                textIncludesSearch(field.label, keyword) ||
                textIncludesSearch(field.value, keyword)
            ) ||
            (chips as unknown[]).some((chip: unknown) =>
              textIncludesSearch(
                typeof chip === 'string'
                  ? chip
                  : (chip as Record<string, unknown>).label,
                keyword
              )
            );
          if (!matchesKeyword) return false;
        }

        return true;
      })
      .sort((a, b) => {
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
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const displayedCards = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCards.slice(start, start + pageSize);
  }, [filteredCards, page, pageSize]);

  const allExpanded =
    filteredCards.length > 0 &&
    filteredCards.every((card) => expandedIds.has(card.id));

  const ordenacaoSections = useMemo(
    () => [
      {
        title: 'CLASSIFICAR POR',
        items: PROCESSO_TAREFAS_TAB_SORT_FIELDS.map((field) => ({
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
    ],
    [sortDirection, sortField]
  );

  const toggleExpanded = (cardId: unknown) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(cardId) ? next.delete(cardId) : next.add(cardId);
      return next;
    });
  };

  const toggleAllExpanded = () => {
    setExpandedIds((prev) => {
      if (allExpanded) {
        const next = new Set(prev);
        filteredCards.forEach((card) => next.delete(card.id));
        return next;
      }
      const next = new Set(prev);
      filteredCards.forEach((card) => next.add(card.id));
      return next;
    });
  };

  const handleClearAppliedFilters = () => {
    setAppliedFilters(createEmptyFilters());
    setPendingFilters(createEmptyFilters());
  };

  const hasAppliedFilters = !filtersEqual(
    appliedFilters as unknown as Record<
      string,
      Set<string> | { from: string | null; to: string | null }
    >,
    createEmptyFilters() as unknown as Record<
      string,
      Set<string> | { from: string | null; to: string | null }
    >
  );

  const rangeStart = filteredCards.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filteredCards.length);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%',
        minHeight: 0,
        padding: '0 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        {/* Left: icon btns + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Sort */}
          <div ref={sortRef} style={{ position: 'relative' }}>
            <ToolbarIconBtn
              title={PROCESSO_TAREFAS_TAB_TOOLBAR.tooltips.ordenar}
              active={sortOpen}
              onClick={() => setSortOpen((v) => !v)}
            >
              <ImportExportIcon style={{ fontSize: 15 }} />
            </ToolbarIconBtn>
            {sortOpen && (
              <SortMenu sections={ordenacaoSections} onClose={() => setSortOpen(false)} />
            )}
          </div>

          {/* Density / expand */}
          <ToolbarIconBtn
            title={PROCESSO_TAREFAS_TAB_TOOLBAR.tooltips.expandirRetrair}
            active={allExpanded}
            onClick={toggleAllExpanded}
          >
            <ViewListIcon style={{ fontSize: 15 }} />
          </ToolbarIconBtn>

          {/* Filters */}
          <ToolbarIconBtn
            title={PROCESSO_TAREFAS_TAB_TOOLBAR.tooltips.filtros}
            active={hasAppliedFilters}
            onClick={() => {
              setPendingFilters(
                copyFilters(
                  appliedFilters as unknown as Record<
                    string,
                    Set<string> | { from: string | null; to: string | null }
                  >
                )
              );
              setFiltersOpen(true);
            }}
          >
            <TuneIcon style={{ fontSize: 15 }} />
          </ToolbarIconBtn>

          {/* Search */}
          <SearchInputWidget
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={PROCESSO_TAREFAS_TAB_TOOLBAR.busca.placeholder}
          />

          {/* Clear filters chip */}
          {hasAppliedFilters && (
            <button
              type="button"
              onClick={handleClearAppliedFilters}
              title="Limpar filtros"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid ${colors.primary.main}`,
                background: '#EFF6FF',
                color: colors.primary.main,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {filteredCards.length} resultado{filteredCards.length !== 1 ? 's' : ''}
              ×
            </button>
          )}
        </div>

        {/* Right: status legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {TAREFA_SITUACAO_LEGEND.map((item) => {
            const ui = LEGEND_UI[item.key];
            if (!ui) return null;
            const Icon = ui.Icon;
            return (
              <div
                key={item.key}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: ui.bg,
                    color: ui.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ fontSize: 10 }} />
                </span>
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Meta row: count + pagination ── */}
      {filteredCards.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#9CA3AF',
          }}
        >
          <span>Qtde. de registros: {filteredCards.length}</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Per page */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280' }}>
              <span>Linhas por página:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  fontSize: 11,
                  border: '1px solid #E5E7EB',
                  borderRadius: 4,
                  padding: '1px 4px',
                  color: '#374151',
                  background: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            {/* Range */}
            <span>
              {rangeStart}-{rangeEnd} de {filteredCards.length}
            </span>

            {/* Pagination buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PageBtn
                title="Primeira"
                onClick={() => setPage(1)}
                disabled={page <= 1}
              >
                <FirstPageIcon style={{ fontSize: 12 }} />
              </PageBtn>
              <PageBtn
                title="Anterior"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeftIcon style={{ fontSize: 12 }} />
              </PageBtn>
              <PageBtn active>{page}</PageBtn>
              <PageBtn
                title="Próxima"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRightIcon style={{ fontSize: 12 }} />
              </PageBtn>
              <PageBtn
                title="Última"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
              >
                <LastPageIcon style={{ fontSize: 12 }} />
              </PageBtn>
            </div>
          </div>
        </div>
      )}

      {/* ── Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredCards.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              color: '#9CA3AF',
              gap: 10,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 13, margin: 0 }}>Nenhuma tarefa encontrada.</p>
          </div>
        ) : (
          displayedCards.map((card) => (
            <ProcessTaskCard
              key={card.id}
              card={card}
              chips={chipsMap.get(card.id) ?? card.chips}
              possuiFluxo={possuiFluxo}
              assigned={
                isTarefaAtribuida?.(card.id) ?? card.statusAtribuicao === 'atribuida'
              }
              expanded={expandedIds.has(card.id)}
              onToggle={() => toggleExpanded(card.id)}
              onOpenTask={onOpenTask}
              onToggleAssignment={onToggleTaskAssignment}
            />
          ))
        )}
      </div>

      {/* ── Filters modal ── */}
      <FiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        pendingFilters={pendingFilters}
        onPendingChange={setPendingFilters}
        onSave={() => {
          setAppliedFilters(
            copyFilters(
              pendingFilters as unknown as Record<
                string,
                Set<string> | { from: string | null; to: string | null }
              >
            )
          );
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
