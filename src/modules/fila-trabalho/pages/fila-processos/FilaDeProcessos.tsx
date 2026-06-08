import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Chip } from '../../../../domain/shared.types';
import type { WorkQueueCard, ProcessQueueFilters, FieldOverrideMap } from '../../types';
import type { Categoria } from '../../../../domain/categorias/types/categoriaTypes';

// Estrutura compartilhada da fila
import { WorkQueue } from '../../WorkQueue';

// DS Atoms — SideMenu (conteúdo do painel de categorias)
import { SideMenuSection } from '../../../../components/ds/atoms/SideMenu/SideMenuSection';
import { SideMenuItem } from '../../../../components/ds/atoms/SideMenu/SideMenuItem';

// DS Atoms — Card, Button, Tabs

// Custom components
import { ButtonHint } from '../../../../components/custom/ButtonHint';
import { AttachmentCardProcesso } from '../../../../components/custom/AttachmentCardProcesso';
import { CategoriasDropdown } from '../../../../components/custom/CategoriasDropdown';
import { ProcessoDetalhePanel } from '../../../solar/processos/components/ProcessoDetalhePanel';
import { CriarTagModal } from '../../../../components/custom/CriarTagModal';
import { GerenciarTagsModal } from '../../../../components/custom/GerenciarTagsModal';
import { LembretesModal } from '../../../../components/custom/LembretesModal';
import { VisualizacaoPersonalizadaModal } from '../../components/VisualizacaoPersonalizadaModal';
import {
  FiltersModal,
  emptyFilters,
  copyFilters,
  filtersEqual,
} from '../../components/FiltersModal';
import { dateInRange } from '../../../../domain/filtros/dateRange';
import { PersonalizarCardsModal } from '../../components/PersonalizarCardsModal';
import { PrazoModal } from '../../../../components/custom/PrazoModal';
import { useCustomViews } from '../../providers/useCustomViews';
import type { CustomView } from '../../providers/useCustomViews';
import type { FilterState } from '../../../../domain/filtros/filterModel';

// DS Atoms — Chip, Snackbar
import { Snackbar } from '../../../../components/ds/atoms/Snackbar/Snackbar';

// DS Atoms — Table

// ── Configs ──────────────────────────────────────────────────────────────────
import { sidebarCategoriasConfig } from '../../config/shared.sidebar-categorias';
import { cardConfig } from './config.processos';
import { useCategorias } from '../../../../application/providers/useCategorias';
import { PROCESSO_LABELS } from '../../fields/processoQueueFields';
import { getProcessCardFieldValue } from '../../selectors/processoQueue.selectors';
import { useProcessos } from '../../hooks/useProcessos';
import { processoCardToDetail } from '../../../../domain/processos/adapters/processoToDetail.adapter';

// ── Utils compartilhados ──────────────────────────────────────────────────────
import {
  uniqueVals,
  normalizeChipLabel,
  getBulkActionEligibility,
  getSortValue,
  parseSortableValue,
  resolveDisplayFields,
  textIncludesSearch,
} from '../../utils/workQueueUtils';
import { SYSTEM_TAGS, systemChip, hasSystemChip } from '@/domain/categorias/systemTags';

// MUI Icons — Card

// MUI Icons — Controls
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import ArchiveIcon from '@mui/icons-material/Archive';
import HistoryIcon from '@mui/icons-material/History';

// ─── Utilitários de filtragem ─────────────────────────────────────────────────

const RECEIVED_PROCESS_BG = '#FFFFFF';

function getProcessTipo(p: WorkQueueCard): string | null {
  if (p.statusActions?.some((a) => a.iconKey === 'library_books')) return 'Processo';
  if (p.statusActions?.some((a) => a.iconKey === 'insert_drive_file')) return 'Documento';
  return null;
}
function getProcessNatureza(p: WorkQueueCard): string {
  return p.statusActions?.some(
    (a) => ['library_books', 'insert_drive_file'].includes(a.iconKey) && a.active
  )
    ? 'Digital'
    : 'Físico';
}
function getProcessEncaminhamento(p: WorkQueueCard): string | null {
  if (p.statusActions?.some((a) => a.iconKey === 'groups')) return 'Encaminhado para o setor';
  if (p.statusActions?.some((a) => a.iconKey === 'person')) return 'Encaminhado para mim';
  return null;
}
function getProcessFluxo(p: WorkQueueCard): string {
  return p.statusActions?.find((a) => a.iconKey === 'etapas')?.active
    ? 'Possui fluxo'
    : 'Sem fluxo';
}
function getProcessTarefas(p: WorkQueueCard): string {
  return (p.documentCount ?? 0) > 0 ? 'Em aberto' : 'Sem tarefas';
}
function getProcessSigilo(p: WorkQueueCard): string {
  return p.statusActions?.find((a) => a.iconKey === 'lock')?.active ? 'Sim' : 'Não';
}

function getProcessFieldValue(
  processo: WorkQueueCard,
  label: string,
  fieldOverrideMap: FieldOverrideMap | null = null
): string | undefined {
  return getProcessCardFieldValue(processo, label, fieldOverrideMap);
}

function getProcessChips(
  processo: WorkQueueCard,
  processChipsMap: Map<string, Chip[]> | null = null
): Chip[] {
  return processChipsMap?.get(processo.id) ?? processo.chips ?? [];
}

function getDerivedFilterOptions(
  processos: WorkQueueCard[],
  extra: { cadastradoPor?: string[] } = {},
  fieldOverrideMap: FieldOverrideMap | null = null,
  processChipsMap: Map<string, Chip[]> | null = null
): Record<string, string[]> {
  return {
    processoDocumento: uniqueVals(processos.map((p) => p.processNumber)),
    classificacao: uniqueVals(processos.map((p) => p.processClass)),
    interessado: uniqueVals(
      processos.map((p) => getProcessFieldValue(p, 'interessado', fieldOverrideMap))
    ),
    cadastradoPor: uniqueVals([
      ...processos.map((p) => getProcessFieldValue(p, 'cadastradoPor', fieldOverrideMap)),
      ...(extra.cadastradoPor ?? []),
    ]),
    categoria: uniqueVals(
      processos.flatMap((p) =>
        getProcessChips(p, processChipsMap).map((c) =>
          normalizeChipLabel(typeof c === 'string' ? c : c.label)
        )
      )
    ),
    unidadeEncaminhamento: uniqueVals(
      processos.map((p) => getProcessFieldValue(p, 'unidadeEncaminhamento', fieldOverrideMap))
    ),
    unidadeAtual: uniqueVals(
      processos.map((p) => getProcessFieldValue(p, 'unidadeAtual', fieldOverrideMap))
    ),
    recebidoPor: uniqueVals(
      processos.map((p) => getProcessFieldValue(p, 'recebidoPor', fieldOverrideMap))
    ),
  };
}

function processMatchesAppliedFilters(
  processo: WorkQueueCard,
  filters: ProcessQueueFilters,
  fieldOverrideMap: FieldOverrideMap | null = null,
  processChipsMap: Map<string, Chip[]> | null = null
): boolean {
  if (filters.tipo.size > 0 && !filters.tipo.has(getProcessTipo(processo) ?? '')) return false;
  if (filters.natureza.size > 0 && !filters.natureza.has(getProcessNatureza(processo)))
    return false;
  if (
    filters.encaminhamento.size > 0 &&
    !filters.encaminhamento.has(getProcessEncaminhamento(processo) ?? '')
  )
    return false;
  if (filters.fluxo.size > 0 && !filters.fluxo.has(getProcessFluxo(processo))) return false;
  if (filters.tarefas.size > 0 && !filters.tarefas.has(getProcessTarefas(processo))) return false;
  if (filters.sigilo.size > 0 && !filters.sigilo.has(getProcessSigilo(processo))) return false;
  if (
    filters.processoDocumento.size > 0 &&
    !filters.processoDocumento.has(processo.processNumber ?? '')
  )
    return false;
  if (filters.classificacao.size > 0 && !filters.classificacao.has(processo.processClass ?? ''))
    return false;
  if (filters.interessado.size > 0) {
    const v = getProcessFieldValue(processo, 'interessado', fieldOverrideMap);
    if (!v || !filters.interessado.has(v)) return false;
  }
  if (filters.cadastradoPor.size > 0) {
    const v = getProcessFieldValue(processo, 'cadastradoPor', fieldOverrideMap);
    if (!v || !filters.cadastradoPor.has(v)) return false;
  }
  if (filters.categoria.size > 0) {
    const ok = getProcessChips(processo, processChipsMap).some((c) => {
      const raw = typeof c === 'string' ? c : c.label;
      return filters.categoria.has(normalizeChipLabel(raw));
    });
    if (!ok) return false;
  }
  if (filters.unidadeEncaminhamento.size > 0) {
    const v = getProcessFieldValue(processo, 'unidadeEncaminhamento', fieldOverrideMap);
    if (!v || !filters.unidadeEncaminhamento.has(v)) return false;
  }
  if (filters.unidadeAtual.size > 0) {
    const v = getProcessFieldValue(processo, 'unidadeAtual', fieldOverrideMap);
    if (!v || !filters.unidadeAtual.has(v)) return false;
  }
  if (filters.recebidoPor?.size > 0) {
    const v = getProcessFieldValue(processo, 'recebidoPor', fieldOverrideMap);
    if (!v || v === '-' || !filters.recebidoPor.has(v)) return false;
  }
  if (filters.dataEntrada?.from || filters.dataEntrada?.to) {
    if (
      !dateInRange(
        getProcessFieldValue(processo, 'dataEntrada', fieldOverrideMap) ?? '',
        filters.dataEntrada
      )
    )
      return false;
  }
  if (filters.dataEncaminhamento?.from || filters.dataEncaminhamento?.to) {
    if (
      !dateInRange(
        getProcessFieldValue(processo, 'dataEncaminhamento', fieldOverrideMap) ?? '',
        filters.dataEncaminhamento
      )
    )
      return false;
  }
  if (filters.prazoEncaminhamento?.from || filters.prazoEncaminhamento?.to) {
    if (
      !dateInRange(
        getProcessFieldValue(processo, 'prazoEncaminhamento', fieldOverrideMap) ?? '',
        filters.prazoEncaminhamento
      )
    )
      return false;
  }
  if (filters.recebidoEm?.from || filters.recebidoEm?.to) {
    if (
      !dateInRange(
        getProcessFieldValue(processo, 'recebidoEm', fieldOverrideMap) ?? '',
        filters.recebidoEm
      )
    )
      return false;
  }
  return true;
}

function processMatches(processo: WorkQueueCard, searchTerm: string): boolean {
  if (textIncludesSearch(processo.processNumber, searchTerm)) return true;
  if (textIncludesSearch(processo.processClass, searchTerm)) return true;
  if (
    processo.fields?.some(
      (f) => textIncludesSearch(f.value, searchTerm) || textIncludesSearch(f.label, searchTerm)
    )
  )
    return true;
  if (
    processo.extraFields?.some(
      (f) => textIncludesSearch(f.value, searchTerm) || textIncludesSearch(f.label, searchTerm)
    )
  )
    return true;
  if (processo.chips?.some((chip) => textIncludesSearch(chip.label, searchTerm))) return true;
  return false;
}

interface FilaDeProcessosProps {
  onNavigate?: (page: string) => void;
  onSidebarChange?: (content: ReactNode) => void;
  crossCounts?: unknown;
  onCountsChange?: (counts: unknown) => void;
}

export function FilaDeProcessos({
  onNavigate,
  onSidebarChange,
  crossCounts,
  onCountsChange,
}: FilaDeProcessosProps) {
  const processos = useProcessos();
  const {
    externalTags,
    personalTags,
    savePersonalTag,
    deletePersonalTag,
    getChipsMap,
    updateChipsMap,
    countTagUsage,
  } = useCategorias();
  const processChipsMap = getChipsMap('processos');
  const setProcessChipsMap = (
    updater: Map<string, Chip[]> | ((m: Map<string, Chip[]>) => Map<string, Chip[]>)
  ) => updateChipsMap('processos', updater);
  const [activeTab, setActiveTab] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(cardConfig.dados.paginacao.page);
  const [pageSize, setPageSize] = useState(cardConfig.dados.paginacao.pageSize);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [pinOrder, setPinOrder] = useState<string[]>([]);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(emptyFilters());
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [manageTagsOpen, setManageTagsOpen] = useState(false);
  const [lembretesOpen, setLembretesOpen] = useState(false);
  const [lembretesItems, setLembretesItems] = useState<string[]>([]);
  const {
    customViews,
    setCustomViews,
    pinnedSidebarViews,
    setPinnedSidebarViews,
    activeViewLabel,
    setActiveViewLabel,
    activeViewBaseFilters: customViewBaseFilters,
    setActiveViewBaseFilters: setCustomViewBaseFilters,
    appliedFilters: ctxAppliedFilters,
    setAppliedFilters,
  } = useCustomViews('processos');
  const visualizacao = activeViewLabel ?? cardConfig.controles.visualizacaoValor;
  const setVisualizacao = setActiveViewLabel;
  const appliedFilters = ctxAppliedFilters ?? emptyFilters();
  const {
    customViews: tarefasCustomViews,
    pinnedSidebarViews: tarefasPinnedViews,
    setActiveViewLabel: setTarefasActiveViewLabel,
    setActiveViewBaseFilters: setTarefasActiveViewBaseFilters,
    setAppliedFilters: setTarefasAppliedFilters,
  } = useCustomViews('tarefas');
  const [customViewOpen, setCustomViewOpen] = useState(false);
  const [editCustomViewOpen, setEditCustomViewOpen] = useState(false);
  const [editingCustomView, setEditingCustomView] = useState<CustomView | null>(null);
  const [personalizacaoOpen, setPersonalizacaoOpen] = useState(false);
  const [savedPersonalizacao, setSavedPersonalizacao] = useState(
    cardConfig.defaultPersonalizacaoItems
  );
  const [prazoOpen, setPrazoOpen] = useState(false);
  const [prazoMode, setPrazoMode] = useState('agendar');
  const [sortField, setSortField] = useState(
    () =>
      cardConfig.controles.ordenacao
        .find((s) => s.titulo === 'CLASSIFICAR POR')
        ?.itens.find((i) => i.selecionado)?.label ??
      cardConfig.controles.ordenacao[0]?.itens[0]?.label ??
      ''
  );
  const [sortDirection, setSortDirection] = useState(
    () =>
      cardConfig.controles.ordenacao
        .find((s) => s.titulo === 'ORDENAR POR')
        ?.itens.find((i) => i.selecionado)?.label ?? 'Crescente'
  );
  const [foraFilaIds, setForaFilaIds] = useState(
    () => new Set(processos.filter((p) => p.foraFila).map((p) => p.id))
  );
  // Prazo interno por processo — usado apenas para pré-preencher o modal "Reagendar prazo".
  // NÃO é o "Prazo encaminhamento" do card, que vem da tramitação do processo.
  // Inicializado a partir de fimPrazoInterno do mock para processos já foraFila.
  const [prazoInternoMap, setPrazoInternoMap] = useState<Map<string, string>>(
    () => new Map(
      processos
        .filter(p => p.foraFila && p.fimPrazoInterno)
        .map(p => [p.id, p.fimPrazoInterno as string])
    )
  );
  const [processBgColorMap, setProcessBgColorMap] = useState<Map<string, string>>(
    () =>
      new Map(processos.map((p) => [p.id, p.bgColor ?? RECEIVED_PROCESS_BG] as [string, string]))
  );
  const [fieldOverrideMap, setFieldOverrideMap] = useState<FieldOverrideMap>(() => {
    const init = new Map<string, Record<string, string>>();
    processos.filter(p => p.foraFila && p.fimPrazoInterno).forEach(p => {
      init.set(p.id, { 'Prazo agendamento': p.fimPrazoInterno as string });
    });
    return init;
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openedProcessId, setOpenedProcessId] = useState<string | null>(null);
  const [openedProcessInitialTab, setOpenedProcessInitialTab] = useState(0);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [processDetailForPanel, setProcessDetailForPanel] = useState<ReturnType<
    typeof processoCardToDetail
  > | null>(null);
  const processPanelCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (processPanelCloseTimer.current) clearTimeout(processPanelCloseTimer.current);
    },
    []
  );

  const closeTransientState = () => {
    setFiltersOpen(false);
    setCreateTagOpen(false);
    setManageTagsOpen(false);
    setLembretesOpen(false);
    setCustomViewOpen(false);
    setEditCustomViewOpen(false);
    setEditingCustomView(null);
    setPersonalizacaoOpen(false);
    setPrazoOpen(false);
    setCheckedIds(new Set());
    setExpandedIds(new Set());
    setSelectedProcessId(null);
    setOpenedProcessId(null);
    setOpenedProcessInitialTab(0);
    setProcessDetailForPanel(null);
    if (processPanelCloseTimer.current) clearTimeout(processPanelCloseTimer.current);
  };

  const navigateFromMenu = (pageName: string) => {
    closeTransientState();
    onNavigate?.(pageName);
  };

  const isReceivedProcess = (processo: WorkQueueCard) =>
    (processBgColorMap.get(processo.id) ?? RECEIVED_PROCESS_BG).toUpperCase() ===
    RECEIVED_PROCESS_BG;

  const isForaFila = visualizacao === 'Fora da fila de trabalho';
  const hasAppliedFilters = customViewBaseFilters
    ? !filtersEqual(appliedFilters, customViewBaseFilters)
    : Object.values(appliedFilters).some((v) =>
        v instanceof Set
          ? v.size > 0
          : !!(
              (v as { from?: string | null; to?: string | null } | null)?.from ||
              (v as { from?: string | null; to?: string | null } | null)?.to
            )
      );
  const filteredProcessos = processos.filter((processo) => {
    const fora = foraFilaIds.has(processo.id);
    if (isForaFila && !fora) return false;
    if (!isForaFila && fora) return false;
    if (activeTab === 1 && !isReceivedProcess(processo)) return false;
    if (activeTab === 2 && isReceivedProcess(processo)) return false;
    if (keyword && !processMatches(processo, keyword)) return false;
    if (
      (customViewBaseFilters || hasAppliedFilters) &&
      !processMatchesAppliedFilters(
        processo,
        appliedFilters as ProcessQueueFilters,
        fieldOverrideMap,
        processChipsMap
      )
    )
      return false;
    return true;
  });

  const viewProcessos = processos.filter((p) =>
    isForaFila ? foraFilaIds.has(p.id) : !foraFilaIds.has(p.id)
  );
  const tabLabels = [
    `Todos (${viewProcessos.length})`,
    `Recebidos (${viewProcessos.filter(isReceivedProcess).length})`,
    `Não recebidos (${viewProcessos.filter((p) => !isReceivedProcess(p)).length})`,
  ];

  const sortedProcessos = [...filteredProcessos].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id);
    const bPinned = pinnedIds.has(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    if (aPinned && bPinned) return pinOrder.indexOf(a.id) - pinOrder.indexOf(b.id);
    const aVal = parseSortableValue(getSortValue(a, sortField, cardConfig.controles.ordenacao));
    const bVal = parseSortableValue(getSortValue(b, sortField, cardConfig.controles.ordenacao));
    const cmp = aVal.localeCompare(bVal);
    return sortDirection === 'Crescente' ? cmp : -cmp;
  });

  const displayedProcessos = sortedProcessos.slice((page - 1) * pageSize, page * pageSize);
  const visibleProcessIds = displayedProcessos.map((p) => p.id);

  const allExpanded =
    visibleProcessIds.length > 0 && visibleProcessIds.every((id) => expandedIds.has(id));
  const allChecked =
    visibleProcessIds.length > 0 && visibleProcessIds.every((id) => checkedIds.has(id));

  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const handleProcessCardClick = (id: string) => {
    toggleExpanded(id);
    // Deseleciona ao clicar novamente no card selecionado (fora do overlay)
    if (!openedProcessId && selectedProcessId === id) {
      setSelectedProcessId(null);
    }
  };
  const toggleAllExpanded = () =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      visibleProcessIds.forEach((id) => {
        if (allExpanded) next.delete(id);
        else next.add(id);
      });
      return next;
    });

  const toggleChecked = (id: string) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAllChecked = () =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      visibleProcessIds.forEach((id) => {
        if (allChecked) next.delete(id);
        else next.add(id);
      });
      return next;
    });

  const moveProcessToTopByPin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      const isPinned = next.has(id);

      if (isPinned) {
        next.delete(id);
        setPinOrder((order) => order.filter((itemId) => itemId !== id));
      } else {
        next.add(id);
        setPinOrder((order) => [id, ...order.filter((itemId) => itemId !== id)]);
      }

      return next;
    });
  };

  const categoriaItems = [
    ...new Map([...externalTags, ...personalTags].map((c) => [c.label, c] as const)).values(),
  ];

  const handleLembretesClick = (proc: WorkQueueCard) => {
    setLembretesItems(
      (proc.lembretes ?? [])
        .map((lembrete) => {
          if (typeof lembrete === 'string') return lembrete;
          return String((lembrete as Record<string, unknown>).texto ?? '');
        })
        .filter(Boolean)
    );
    setLembretesOpen(true);
  };

  const handleApplyTags = (tagStates: Map<string, string>) => {
    setProcessChipsMap((prev) => {
      const next = new Map(prev);
      checkedIds.forEach((id) => {
        let chips: Chip[] = [...(next.get(id) ?? [])];
        tagStates.forEach((state, label) => {
          if (state === 'checked') {
            const tag = categoriaItems.find((t) => t.label === label);
            if (tag && !chips.some((c) => c.label === label)) {
              chips = [...chips, tag];
            }
          } else if (state === 'unchecked') {
            chips = chips.filter((c) => c.label !== label);
          }
        });
        next.set(id, chips);
      });
      return next;
    });
  };

  const handleSaveTag = (updated: Record<string, unknown>, originalLabel?: string) => {
    savePersonalTag(updated as Partial<Categoria>, originalLabel);
  };

  const handleDeleteTag = (label: string) => {
    deletePersonalTag(label);
  };

  const handleSaveCustomView = (view: {
    label: string;
    filters: FilterState;
    pinInSidebar: boolean;
    originalLabel: string | null;
  }) => {
    const newView = { label: view.label, filters: view.filters, pinInSidebar: view.pinInSidebar };
    setCustomViews((prev) => [...prev, newView]);
    const baseFx = copyFilters(view.filters);
    setVisualizacao(view.label);
    setCustomViewBaseFilters(baseFx);
    setAppliedFilters(baseFx);
    setPendingFilters(baseFx);
    setActiveTab(0);
    setPage(1);
    if (view.pinInSidebar) setPinnedSidebarViews((prev) => [...prev, { label: view.label }]);
    setCustomViewOpen(false);
  };

  const handleSaveEditCustomView = (view: {
    label: string;
    filters: FilterState;
    pinInSidebar: boolean;
    originalLabel: string | null;
  }) => {
    const updatedView = {
      label: view.label,
      filters: view.filters,
      pinInSidebar: view.pinInSidebar,
    };
    setCustomViews((prev) => prev.map((v) => (v.label === view.originalLabel ? updatedView : v)));

    const wasPinned = pinnedSidebarViews.some((v) => v.label === view.originalLabel);
    if (wasPinned) {
      if (view.pinInSidebar) {
        setPinnedSidebarViews((prev) =>
          prev.map((v) => (v.label === view.originalLabel ? { label: view.label } : v))
        );
      } else {
        setPinnedSidebarViews((prev) => prev.filter((v) => v.label !== view.originalLabel));
      }
    } else if (view.pinInSidebar) {
      setPinnedSidebarViews((prev) => [...prev, { label: view.label }]);
    }

    if (visualizacao === view.originalLabel) {
      const baseFx = copyFilters(view.filters);
      setVisualizacao(view.label);
      setCustomViewBaseFilters(baseFx);
      setAppliedFilters(baseFx);
      setPendingFilters(baseFx);
      setPage(1);
    }

    setEditCustomViewOpen(false);
    setEditingCustomView(null);
  };

  const handleDeleteCustomView = () => {
    const label = editingCustomView?.label;
    if (!label) return;
    setCustomViews((prev) => prev.filter((v) => v.label !== label));
    setPinnedSidebarViews((prev) => prev.filter((v) => v.label !== label));
    if (visualizacao === label) {
      setVisualizacao(cardConfig.controles.visualizacaoValor);
      setCustomViewBaseFilters(null);
      setAppliedFilters(emptyFilters());
      setPendingFilters(emptyFilters());
      setPage(1);
    }
    setEditCustomViewOpen(false);
    setEditingCustomView(null);
  };

  const handleSavePrazo = (
    selectedIds: string[],
    option: string,
    fimPrazoByItem: Map<string, string>
  ) => {
    setProcessChipsMap((prev) => {
      const next = new Map(prev);
      selectedIds.forEach((id) => {
        const chips: Chip[] = [...(next.get(id) ?? [])];
        if (!hasSystemChip(chips, SYSTEM_TAGS.AGUARDANDO_PRAZO)) {
          chips.push(systemChip(SYSTEM_TAGS.AGUARDANDO_PRAZO));
        }
        next.set(id, chips);
      });
      return next;
    });

    // Persiste prazo interno para pré-preencher o modal "Reagendar prazo"
    // e para exibir no campo "Prazo agendamento" se o usuário ativá-lo via personalização.
    if (fimPrazoByItem?.size > 0) {
      setPrazoInternoMap((prev) => {
        const next = new Map(prev);
        fimPrazoByItem.forEach((date, id) => {
          if (date) next.set(id, date);
        });
        return next;
      });
      setFieldOverrideMap((prev) => {
        const next = new Map(prev);
        fimPrazoByItem.forEach((date, id) => {
          if (date) next.set(id, { ...(next.get(id) ?? {}), 'Prazo agendamento': date });
        });
        return next;
      });
    }

    if (prazoMode === 'agendar' && option === 'return') {
      // Processo(s) movidos para Fora da Fila → navega para a visualização correta e seleciona
      setForaFilaIds((prev) => {
        const next = new Set(prev);
        selectedIds.forEach((id) => next.add(id));
        return next;
      });
      setPage(1);
      setVisualizacao('Fora da fila de trabalho');
      setCustomViewBaseFilters(null);
      setAppliedFilters(emptyFilters());
      setPendingFilters(emptyFilters());
      setActiveTab(0);
      // Seleciona automaticamente os processos movidos na nova visualização
      setCheckedIds(new Set(selectedIds));
      // Scroll para o primeiro processo movido após o render
      setTimeout(() => {
        document
          .querySelector(`[data-id="${selectedIds[0]}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    } else if (prazoMode === 'reagendar' && option === 'stay') {
      // Processo(s) retornaram para a Fila → navega para a fila principal e seleciona
      setForaFilaIds((prev) => {
        const next = new Set(prev);
        selectedIds.forEach((id) => next.delete(id));
        return next;
      });
      setPage(1);
      setVisualizacao(cardConfig.controles.visualizacaoValor);
      setCustomViewBaseFilters(null);
      setAppliedFilters(emptyFilters());
      setPendingFilters(emptyFilters());
      setActiveTab(0);
      setCheckedIds(new Set(selectedIds));
      setTimeout(() => {
        document
          .querySelector(`[data-id="${selectedIds[0]}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    } else {
      setCheckedIds(new Set());
    }

    setPrazoOpen(false);
  };

  const handleReceber = () => {
    const selected = processos.filter((p) => checkedIds.has(p.id));
    const toReceive = selected.filter((p) => !isReceivedProcess(p));
    if (toReceive.length === 0) {
      setSnackbarMessage(cardConfig.controles.acoes.mensagemJaRecebidos);
      setSnackbarOpen(true);
      return;
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    const now = new Date();
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setProcessBgColorMap((prev) => {
      const next = new Map(prev);
      toReceive.forEach((p) => next.set(p.id, RECEIVED_PROCESS_BG));
      return next;
    });
    setFieldOverrideMap((prev) => {
      const next = new Map(prev);
      toReceive.forEach((p) => {
        next.set(p.id, {
          ...(next.get(p.id) ?? {}),
          [PROCESSO_LABELS.recebidoEm]: dateStr,
          [PROCESSO_LABELS.recebidoPor]: cardConfig.controles.usuarioRecebimento,
        });
      });
      return next;
    });
    const msg =
      selected.length > toReceive.length
        ? cardConfig.controles.acoes.mensagemJaRecebidos
        : cardConfig.controles.acoes.mensagemRecebidos;
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  const getFields = (proc: WorkQueueCard) =>
    resolveDisplayFields(
      proc,
      savedPersonalizacao,
      cardConfig.personalizacaoItems,
      fieldOverrideMap
    );

  const buildProcessDetail = (processCard: WorkQueueCard) =>
    processoCardToDetail(processCard as unknown as Parameters<typeof processoCardToDetail>[0], {
      readField: (fieldKey: string) =>
        getProcessFieldValue(processCard, fieldKey, fieldOverrideMap),
    });

  const handleOpenProcess = (proc: WorkQueueCard, initialTab = 0) => {
    if (processPanelCloseTimer.current) clearTimeout(processPanelCloseTimer.current);
    // Garante que a página exibida contenha este processo ao fechar o overlay
    const idx = sortedProcessos.findIndex((p) => p.id === proc.id);
    if (idx >= 0) {
      const targetPage = Math.ceil((idx + 1) / pageSize);
      if (targetPage !== page) setPage(targetPage);
    }
    setProcessDetailForPanel(buildProcessDetail(proc));
    setOpenedProcessInitialTab(initialTab);
    setOpenedProcessId(proc.id);
    setSelectedProcessId(proc.id);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(proc.id);
      return next;
    });
  };

  const handleCloseProcess = () => {
    const targetId = openedProcessId;
    setOpenedProcessId(null);
    if (processPanelCloseTimer.current) clearTimeout(processPanelCloseTimer.current);
    processPanelCloseTimer.current = setTimeout(() => {
      setProcessDetailForPanel(null);
      // Rola a lista até o card do processo fechado após a animação do overlay
      document
        .querySelector(`[data-id="${targetId}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      processPanelCloseTimer.current = null;
    }, 280);
  };

  const openedProcessCard = openedProcessId
    ? processos.find((proc) => proc.id === openedProcessId)
    : null;
  const openedProcessDetail = openedProcessCard
    ? buildProcessDetail(openedProcessCard)
    : processDetailForPanel;

  // Navegação Anterior/Próximo — usa sortedProcessos (lista completa filtrada+ordenada,
  // sem paginação) para respeitar a ordenação e os filtros ativos no momento da abertura.
  const processNavIndex = openedProcessId
    ? sortedProcessos.findIndex((p) => p.id === openedProcessId)
    : -1;
  const hasPrev = processNavIndex > 0;
  const hasNext = processNavIndex >= 0 && processNavIndex < sortedProcessos.length - 1;

  const handleNavPrev = () => {
    if (!hasPrev) return;
    handleOpenProcess(sortedProcessos[processNavIndex - 1]);
  };
  const handleNavNext = () => {
    if (!hasNext) return;
    handleOpenProcess(sortedProcessos[processNavIndex + 1]);
  };

  const customViewProcessos = customViewBaseFilters
    ? viewProcessos.filter((p) =>
        processMatchesAppliedFilters(
          p,
          customViewBaseFilters as ProcessQueueFilters,
          fieldOverrideMap,
          processChipsMap
        )
      )
    : viewProcessos;
  const filterOptions = getDerivedFilterOptions(
    customViewProcessos,
    cardConfig.dados.filtros ?? {},
    fieldOverrideMap,
    processChipsMap
  );
  const allFilterOptions = getDerivedFilterOptions(
    viewProcessos,
    cardConfig.dados.filtros ?? {},
    fieldOverrideMap,
    processChipsMap
  );

  const hasSelection = checkedIds.size > 0;
  const selectedProcessos = processos.filter((p) => checkedIds.has(p.id));
  const receivedOnlyEligibility = getBulkActionEligibility(
    selectedProcessos,
    isReceivedProcess,
    'all',
  );
  const unreceivedOnlyEligibility = getBulkActionEligibility(
    selectedProcessos,
    (processo) => !isReceivedProcess(processo),
    'all',
  );
  const receivedOnlyActionHint = (label: string) =>
    hasSelection && !receivedOnlyEligibility.canRun
      ? cardConfig.controles.acoes.mensagemSelecaoApenasRecebidos
      : label;
  const unreceivedOnlyActionHint = (label: string) =>
    hasSelection && !unreceivedOnlyEligibility.canRun
      ? cardConfig.controles.acoes.mensagemSelecaoApenasNaoRecebidos
      : label;
  const showReceber = !isForaFila && activeTab !== 1;
  const showRecusar = !isForaFila && activeTab !== 1;
  const showEncaminhar = !isForaFila && activeTab !== 2;
  const showArquivar = !isForaFila && activeTab !== 2;
  const showPrazo = !isForaFila && activeTab !== 2;

  const handleOpenFilters = () => {
    setPendingFilters(copyFilters(appliedFilters));
    setFiltersOpen(true);
  };
  const handleSaveFilters = () => {
    setAppliedFilters(copyFilters(pendingFilters));
    setFiltersOpen(false);
    setPage(1);
  };
  const handleCloseFilters = () => setFiltersOpen(false);
  const handleClearAppliedFilters = () => {
    const base = customViewBaseFilters ? copyFilters(customViewBaseFilters) : emptyFilters();
    setAppliedFilters(base);
    setPendingFilters(base);
    setPage(1);
  };

  const ordenacaoSections = cardConfig.controles.ordenacao.map((secao) => {
    const isDirectionSection = secao.titulo === 'ORDENAR POR';
    return {
      title: secao.titulo,
      items: secao.itens.map((item) => ({
        label: item.label,
        selected: isDirectionSection ? item.label === sortDirection : item.label === sortField,
        onClick: isDirectionSection
          ? () => {
              setSortDirection(item.label);
              setPage(1);
            }
          : () => {
              setSortField(item.label);
              setPage(1);
            },
      })),
    };
  });

  const sidebarContent = useMemo(
    () => (
      <>
        {sidebarCategoriasConfig.dados.secoes.map((secao, si) => {
          const isVisualizacaoSection = secao.titulo === 'Processos/Documentos';
          const isTarefasSection = secao.titulo === 'Tarefas';
          return (
            <SideMenuSection
              key={si}
              title={secao.titulo}
            >
              {secao.itens.map((item, ii) => {
                if (isVisualizacaoSection) {
                  const isForaFilaItem = item.label === 'Fora da fila de trabalho';
                  return (
                    <SideMenuItem
                      key={ii}
                      label={item.label}
                      count={
                        processos.filter((p) =>
                          isForaFilaItem ? foraFilaIds.has(p.id) : !foraFilaIds.has(p.id)
                        ).length
                      }
                      state={item.label === visualizacao ? 'active' : 'default'}
                      showFavIcon={false}
                      onClick={() => {
                        closeTransientState();
                        setVisualizacao(item.label);
                        setActiveTab(0);
                        setPage(1);
                        setCustomViewBaseFilters(null);
                        setAppliedFilters(emptyFilters());
                        setPendingFilters(emptyFilters());
                      }}
                    />
                  );
                }
                if (isTarefasSection) {
                  return (
                    <SideMenuItem
                      key={ii}
                      label={item.label}
                      count={
                        item.label === 'Tarefas agendadas'
                          ? ((crossCounts as { especial?: number; normal?: number } | null)
                              ?.especial ?? item.count)
                          : ((crossCounts as { especial?: number; normal?: number } | null)
                              ?.normal ?? item.count)
                      }
                      state="default"
                      showFavIcon={false}
                      onClick={() => {
                        setTarefasActiveViewLabel(item.label);
                        setTarefasActiveViewBaseFilters(null);
                        setTarefasAppliedFilters(null);
                        navigateFromMenu('tarefas');
                      }}
                    />
                  );
                }
                return (
                  <SideMenuItem
                    key={ii}
                    label={item.label}
                    count={item.count}
                    state={item.ativo ? 'active' : 'default'}
                    showFavIcon={false}
                    onClick={closeTransientState}
                  />
                );
              })}
              {isVisualizacaoSection &&
                pinnedSidebarViews.map((v, i) => {
                  const cv = customViews.find((c) => c.label === v.label);
                  return (
                    <SideMenuItem
                      key={`pv-${i}`}
                      label={v.label}
                      count={(() => {
                        const base = processos.filter((p) => !foraFilaIds.has(p.id));
                        if (!cv) return base.length;
                        return base.filter((p) =>
                          processMatchesAppliedFilters(
                            p,
                            (cv.filters ?? emptyFilters()) as ProcessQueueFilters,
                            fieldOverrideMap,
                            processChipsMap
                          )
                        ).length;
                      })()}
                      state={v.label === visualizacao ? 'active' : 'default'}
                      showFavIcon={false}
                      onClick={() => {
                        closeTransientState();
                        setVisualizacao(v.label);
                        setActiveTab(0);
                        setPage(1);
                        if (cv) {
                          const baseFx = copyFilters(cv.filters ?? emptyFilters());
                          setCustomViewBaseFilters(baseFx);
                          setAppliedFilters(baseFx);
                          setPendingFilters(baseFx);
                        }
                      }}
                    />
                  );
                })}
              {isTarefasSection &&
                tarefasPinnedViews.map((v, i) => {
                  const cv = tarefasCustomViews.find((c) => c.label === v.label);
                  return (
                    <SideMenuItem
                      key={`tv-${i}`}
                      label={v.label}
                      state="default"
                      showFavIcon={false}
                      onClick={() => {
                        if (cv) {
                          const baseFx = copyFilters(cv.filters ?? emptyFilters());
                          setTarefasActiveViewLabel(v.label);
                          setTarefasActiveViewBaseFilters(baseFx);
                          setTarefasAppliedFilters(baseFx);
                        } else {
                          setTarefasActiveViewLabel(v.label);
                          setTarefasActiveViewBaseFilters(null);
                          setTarefasAppliedFilters(null);
                        }
                        navigateFromMenu('tarefas');
                      }}
                    />
                  );
                })}
            </SideMenuSection>
          );
        })}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      foraFilaIds,
      visualizacao,
      pinnedSidebarViews,
      customViews,
      tarefasCustomViews,
      tarefasPinnedViews,
      processos,
      fieldOverrideMap,
      processChipsMap,
      crossCounts,
    ]
  );

  useEffect(() => {
    onSidebarChange?.(sidebarContent);
  }, [sidebarContent, onSidebarChange]);

  useEffect(() => {
    const base = processos.filter((p) => !foraFilaIds.has(p.id));
    const customViewCounts: Record<string, number> = {};
    pinnedSidebarViews.forEach((v) => {
      const cv = customViews.find((c) => c.label === v.label);
      customViewCounts[v.label] = cv
        ? base.filter((p) =>
            processMatchesAppliedFilters(
              p,
              (cv.filters ?? emptyFilters()) as ProcessQueueFilters,
              fieldOverrideMap,
              processChipsMap
            )
          ).length
        : base.length;
    });
    onCountsChange?.({
      normal: base.length,
      especial: foraFilaIds.size,
      customViewCounts,
    });
  }, [
    processos,
    foraFilaIds,
    pinnedSidebarViews,
    customViews,
    fieldOverrideMap,
    processChipsMap,
    onCountsChange,
  ]);

  const categoriasSlot = (
    <CategoriasDropdown
      items={categoriaItems}
      iconTooltips={cardConfig.controles.categoriasDropdown.tooltipIcones}
      acoes={cardConfig.controles.categoriasDropdown.acoes}
      checkedIds={checkedIds}
      processChipsMap={processChipsMap}
      onApplyTags={handleApplyTags}
      onCreateTag={() => setCreateTagOpen(true)}
      onManageTags={() => setManageTagsOpen(true)}
      hint={cardConfig.controles.acoes.categorias}
      label="Marcadores"
    />
  );

  const actionSlot = (
    <>
      {/* Receber — tbtn-blue: ícone + label */}
      {showReceber && (
        <ButtonHint
          icon={<CallReceivedIcon />}
          label={cardConfig.controles.acoes.receber}
          variant="blue"
          hint={cardConfig.controles.acoes.receber}
          disabled={!hasSelection}
          onClick={handleReceber}
        />
      )}
      {/* Recusar — tbtn-red: ícone + label */}
      {showRecusar && (
        <ButtonHint
          icon={<CancelIcon />}
          label={cardConfig.controles.acoes.cancelar}
          variant="red"
          hint={unreceivedOnlyActionHint(cardConfig.controles.acoes.cancelar)}
          disabled={!unreceivedOnlyEligibility.canRun}
        />
      )}
      {/* Encaminhar / Arquivar / Prazo — ícone só (sem label) */}
      {showEncaminhar && (
        <ButtonHint
          icon={<SendIcon />}
          hint={receivedOnlyActionHint(cardConfig.controles.acoes.encaminhar)}
          disabled={!receivedOnlyEligibility.canRun}
        />
      )}
      {showArquivar && (
        <ButtonHint
          icon={<ArchiveIcon />}
          hint={receivedOnlyActionHint(cardConfig.controles.acoes.arquivar)}
          disabled={!receivedOnlyEligibility.canRun}
        />
      )}
      {(showPrazo || isForaFila) && (
        <ButtonHint
          icon={<HistoryIcon />}
          hint={
            isForaFila
              ? cardConfig.controles.acoes.reagendarPrazo
              : receivedOnlyActionHint(cardConfig.controles.acoes.historico)
          }
          disabled={isForaFila ? !hasSelection : !receivedOnlyEligibility.canRun}
          onClick={() => {
            if (isForaFila ? hasSelection : receivedOnlyEligibility.canRun) {
              setPrazoMode(isForaFila ? 'reagendar' : 'agendar');
              setPrazoOpen(true);
            }
          }}
        />
      )}
    </>
  );

  const renderProcesso = (proc: WorkQueueCard) => (
    <AttachmentCardProcesso
      key={proc.id}
      processNumber={proc.processNumber}
      processClass={proc.processClass}
      bgColor={processBgColorMap.get(proc.id) ?? proc.bgColor}
      fields={getFields(proc).slice(0, 4) as { label?: string; value?: unknown }[]}
      extraFields={getFields(proc).slice(4, 8) as { label?: string; value?: unknown }[]}
      chips={processChipsMap.get(proc.id) ?? proc.chips ?? []}
      statusActions={(proc.statusActions ?? []).map((action) =>
        action.iconKey === 'assignment'
          ? { ...action, onClick: () => handleOpenProcess(proc, 3) }
          : action
      )}
      documentCount={proc.documentCount}
      alertActive={proc.alertActive}
      selected={selectedProcessId === proc.id}
      expanded={expandedIds.has(proc.id)}
      onClick={() => handleProcessCardClick(proc.id)}
      onOpenProcess={() => handleOpenProcess(proc)}
      checked={checkedIds.has(proc.id)}
      onCheckedChange={(e) => {
        e.stopPropagation();
        toggleChecked(proc.id);
      }}
      pinned={pinnedIds.has(proc.id)}
      onPinClick={() => moveProcessToTopByPin(proc.id)}
      onLembretesClick={() => handleLembretesClick(proc)}
    />
  );

  return (
    <>
      <WorkQueue
        texts={cardConfig.textos}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPage(1);
          setCheckedIds(new Set());
        }}
        tabLabels={tabLabels}
        allChecked={allChecked}
        onToggleAllChecked={toggleAllChecked}
        allExpanded={allExpanded}
        onToggleAllExpanded={toggleAllExpanded}
        ordenacaoSections={ordenacaoSections}
        visualizacao={visualizacao}
        visualizacaoOptions={cardConfig.controles.visualizacaoOpcoes}
        customViews={customViews}
        onCreateCustomView={() => setCustomViewOpen(true)}
        onEditCustomView={(label) => {
          const cv = customViews.find((v) => v.label === label);
          if (cv) {
            setEditingCustomView(cv);
            setEditCustomViewOpen(true);
          }
        }}
        onVisualizacaoChange={(label) => {
          setVisualizacao(label);
          setActiveTab(0);
          setPage(1);
          setCheckedIds(new Set());
          const cv = customViews.find((v) => v.label === label);
          if (cv) {
            const baseFx = copyFilters(cv.filters ?? emptyFilters());
            setCustomViewBaseFilters(baseFx);
            setAppliedFilters(baseFx);
            setPendingFilters(baseFx);
          } else {
            setCustomViewBaseFilters(null);
            setAppliedFilters(emptyFilters());
            setPendingFilters(emptyFilters());
          }
        }}
        keyword={keyword}
        onKeywordChange={(e) => {
          setKeyword(e.target.value);
          setPage(1);
        }}
        onOpenFilters={handleOpenFilters}
        hasAppliedFilters={hasAppliedFilters}
        onClearAppliedFilters={handleClearAppliedFilters}
        filteredCount={filteredProcessos.length}
        resultChipColor={
          cardConfig.controles.chipResultadosCor as
            | 'primary'
            | 'warning'
            | 'success'
            | 'surface'
            | 'error'
            | 'support'
        }
        actionSlot={actionSlot}
        categoriasSlot={categoriasSlot}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 15, 20]}
        onPageChange={(p) => {
          setPage(p);
          setCheckedIds(new Set());
        }}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
          setCheckedIds(new Set());
        }}
        displayedItems={displayedProcessos}
        emptyMessage="Nenhum processo/documento encontrado."
        renderItem={renderProcesso}
        overlayPanelOpen={!!openedProcessId}
        overlayOnClose={handleCloseProcess}
        overlayPanel={
          <ProcessoDetalhePanel
            processo={openedProcessDetail as unknown as Record<string, unknown>}
            onClose={handleCloseProcess}
            initialTab={openedProcessInitialTab}
            onPrev={handleNavPrev}
            onNext={handleNavNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
            origin={{ label: cardConfig.textos.titulo }}
          />
        }
        onOpenPersonalizacao={() => setPersonalizacaoOpen(true)}
        onRefresh={() => {}}
      />

      <PrazoModal
        open={prazoOpen}
        onClose={() => setPrazoOpen(false)}
        onSave={handleSavePrazo}
        mode={prazoMode}
        processos={processos.filter((p) => checkedIds.has(p.id))}
        config={cardConfig.modalPrazo}
        prazoVigenteMap={prazoInternoMap}
      />
      <PersonalizarCardsModal
        open={personalizacaoOpen}
        onClose={() => setPersonalizacaoOpen(false)}
        onSave={(newItems) => {
          setSavedPersonalizacao(newItems);
          setPersonalizacaoOpen(false);
        }}
        savedItems={savedPersonalizacao}
        defaultItems={cardConfig.defaultPersonalizacaoItems}
        allItems={cardConfig.personalizacaoItems}
        config={cardConfig.modalPersonalizarCards}
      />
      <FiltersModal
        open={filtersOpen}
        onClose={handleCloseFilters}
        pendingFilters={pendingFilters}
        onPendingChange={setPendingFilters}
        onSave={handleSaveFilters}
        lockedFilters={customViewBaseFilters ?? undefined}
        filterOptions={filterOptions}
        grupos={cardConfig.modalFiltros.dados.grupos}
        ddRows={cardConfig.modalFiltros.dados.ddRows}
        ddColCount={cardConfig.modalFiltros.dados.ddColCount}
        ddLabels={cardConfig.modalFiltros.dados.ddLabels}
        dateRangeRows={cardConfig.modalFiltros.dados.dateRangeRows}
        dateRangeLabels={cardConfig.modalFiltros.dados.dateRangeLabels}
        emptyFiltersFactory={emptyFilters}
      />
      <CriarTagModal
        open={createTagOpen}
        onClose={() => setCreateTagOpen(false)}
        onSave={(tag) => handleSaveTag(tag)}
        existingLabels={personalTags.map((t) => t.label)}
      />
      <GerenciarTagsModal
        open={manageTagsOpen}
        onClose={() => setManageTagsOpen(false)}
        tags={personalTags as unknown as Record<string, unknown>[]}
        onSaveTag={handleSaveTag}
        onDeleteTag={handleDeleteTag}
        countTagUsage={countTagUsage}
      />
      <LembretesModal
        open={lembretesOpen}
        onClose={() => setLembretesOpen(false)}
        titulo={cardConfig.modalLembretes.titulo}
        lembretes={lembretesItems}
      />
      <VisualizacaoPersonalizadaModal
        open={customViewOpen}
        onClose={() => setCustomViewOpen(false)}
        onSave={handleSaveCustomView}
        filterOptions={allFilterOptions}
        existingLabels={[
          ...cardConfig.controles.visualizacaoOpcoes.map((v) => v.label),
          ...customViews.map((v) => v.label),
        ]}
        grupos={cardConfig.modalFiltros.dados.grupos}
        ddRows={cardConfig.modalFiltros.dados.ddRows}
        ddColCount={cardConfig.modalFiltros.dados.ddColCount}
        ddLabels={cardConfig.modalFiltros.dados.ddLabels}
        dateRangeRows={cardConfig.modalFiltros.dados.dateRangeRows}
        dateRangeLabels={cardConfig.modalFiltros.dados.dateRangeLabels}
        emptyFiltersFactory={emptyFilters}
      />
      <VisualizacaoPersonalizadaModal
        open={editCustomViewOpen}
        onClose={() => {
          setEditCustomViewOpen(false);
          setEditingCustomView(null);
        }}
        onSave={handleSaveEditCustomView}
        onDelete={handleDeleteCustomView}
        filterOptions={allFilterOptions}
        existingLabels={[
          ...cardConfig.controles.visualizacaoOpcoes.map((v) => v.label),
          ...customViews.map((v) => v.label),
        ]}
        initialView={editingCustomView}
        grupos={cardConfig.modalFiltros.dados.grupos}
        ddRows={cardConfig.modalFiltros.dados.ddRows}
        ddColCount={cardConfig.modalFiltros.dados.ddColCount}
        ddLabels={cardConfig.modalFiltros.dados.ddLabels}
        dateRangeRows={cardConfig.modalFiltros.dados.dateRangeRows}
        dateRangeLabels={cardConfig.modalFiltros.dados.dateRangeLabels}
        emptyFiltersFactory={emptyFilters}
      />
      {snackbarOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
        >
          <Snackbar
            type="warning"
            tone="light"
            message={snackbarMessage}
            onClose={() => setSnackbarOpen(false)}
          />
        </div>
      )}
    </>
  );
}
