import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Chip } from '../../../../domain/shared.types';
import type { WorkQueueCard, TarefaQueueFilters, FieldOverrideMap } from '../../types';
import type { FilterState } from '../../../../domain/filtros/filterModel';
import type { CustomView } from '../../providers/useCustomViews';
import type { Categoria } from '../../../../domain/categorias/types/categoriaTypes';
import type { Tarefa } from '../../../../domain/processos/tarefas/models/tarefa.model';

// Estrutura compartilhada da fila
import { WorkQueue } from '../../WorkQueue';

// DS Atoms — SideMenu (conteúdo do painel de categorias)
import { SideMenuSection } from '../../../../components/ds/atoms/SideMenu/SideMenuSection';
import { SideMenuItem }    from '../../../../components/ds/atoms/SideMenu/SideMenuItem';

// DS Atoms — Card, Button, Tabs

// Custom components
import { ButtonHint }                     from '../../../../components/custom/ButtonHint';
import { AttachmentCardTarefa }           from '../../../../components/custom/AttachmentCardTarefa';
import { CategoriasDropdown }             from '../../../../components/custom/CategoriasDropdown';
import { CriarTagModal }                  from '../../../../components/custom/CriarTagModal';
import { GerenciarTagsModal }             from '../../../../components/custom/GerenciarTagsModal';
import { VisualizacaoPersonalizadaModal } from '../../components/VisualizacaoPersonalizadaModal';
import { FiltersModal, copyFilters, filtersEqual } from '../../components/FiltersModal';
import { dateInRange } from '../../../../domain/filtros/dateRange';
import { PersonalizarCardsModal }         from '../../components/PersonalizarCardsModal';
import { TarefaAgendamentoModal }         from '../../../../components/custom/TarefaAgendamentoModal';
import { useCustomViews }                 from '../../providers/useCustomViews';
import { TarefaDetalhePanel }             from '../../components/TarefaDetalhePanel';
import { ProcessoDetalhePanel }           from '../../../solar/processos/components/ProcessoDetalhePanel';

// DS Atoms — Chip, Snackbar
import { Snackbar } from '../../../../components/ds/atoms/Snackbar/Snackbar';

// DS Atoms — Table

// ── Configs ──────────────────────────────────────────────────────────────────
import { sidebarCategoriasConfig } from '../../config/shared.sidebar-categorias';
import { tarefasConfig }           from './config.tarefas';
import { useCategorias }           from '../../../../application/providers/useCategorias';
import { useTarefasState }         from '../../../../application/providers/useTarefasState';
import { getTaskCardFieldValue } from '../../selectors/tarefaQueue.selectors';
import { getProcessosParaFila } from '../../services/processos.service';
import { useTarefas } from '../../hooks/useTarefas';
import { processoCardToDetail } from '../../../../domain/processos/adapters/processoToDetail.adapter';
import { resolveProcessoForTarefa } from '../../../../domain/processos/tarefas/selectors/processoTarefa.selectors';

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
import { SYSTEM_TAGS, systemChip, hasSystemChip, removeSystemChip } from '@/domain/categorias/systemTags';

// MUI Icons — Card header

// MUI Icons — Controls
import CallReceivedIcon   from '@mui/icons-material/CallReceived';
import ArrowOutwardIcon   from '@mui/icons-material/ArrowOutward';
import CancelIcon         from '@mui/icons-material/Cancel';
import HistoryIcon        from '@mui/icons-material/History';

// ── Filter utilities ──────────────────────────────────────────────────────────

const ASSIGNED_TASK_BG = '#FFFFFF';
const UNASSIGNED_TASK_BG = '#EBF3FF';
const processosRelacionados = getProcessosParaFila();

const SITUACAO_LABELS = {
  em_aberto:  'Em aberto',
  finalizada: 'Finalizada',
  cancelada:  'Cancelada',
  rejeitada:  'Rejeitada',
};
function getTarefaSituacaoLabel(situacao: unknown): string {
  return SITUACAO_LABELS[situacao as keyof typeof SITUACAO_LABELS] ?? (situacao as string) ?? '-';
}

function emptyFiltersTarefas(): FilterState {
  return {
    tipoTarefa:        new Set<string>(),
    situacao:          new Set<string>(),
    processoDocumento: new Set<string>(),
    classificacao:     new Set<string>(),
    interessado:       new Set<string>(),
    atribuidoA:        new Set<string>(),
    responsaveis:      new Set<string>(),
    uniUsrCriacao:     new Set<string>(),
    categoria:         new Set<string>(),
    fluxo:             new Set<string>(),
    dataCriacao:    { from: null, to: null },
    dataPrazo:      { from: null, to: null },
    dataAtribuicao: { from: null, to: null },
  };
}

function getTarefaFieldValue(tarefa: WorkQueueCard, label: string, fieldOverrideMap: FieldOverrideMap | null = null): string | undefined {
  return getTaskCardFieldValue(tarefa, label, fieldOverrideMap);
}

function getTarefaChips(tarefa: WorkQueueCard, taskChipsMap: Map<string, Chip[]> | null = null): Chip[] {
  return taskChipsMap?.get(tarefa.id) ?? tarefa.chips ?? [];
}

function getTarefaChipLabel(chip: string | Chip): string {
  const raw = typeof chip === 'string' ? chip : chip?.label;
  return raw ? normalizeChipLabel(raw) : '';
}

function getDerivedFilterOptionsTarefas(tarefas: WorkQueueCard[], fieldOverrideMap: FieldOverrideMap | null = null, taskChipsMap: Map<string, Chip[]> | null = null): Record<string, string[]> {
  return {
    tipoTarefa:        uniqueVals(tarefas.map(t => t.processNumber)),
    situacao:          uniqueVals(tarefas.map(t => getTarefaSituacaoLabel(t.tarefa?.situacao))),
    processoDocumento: uniqueVals(tarefas.map(t => t.processClass)),
    classificacao:     uniqueVals(tarefas.map(t => getTarefaFieldValue(t, 'Classificação', fieldOverrideMap))),
    interessado:       uniqueVals(tarefas.map(t => getTarefaFieldValue(t, 'Interessado', fieldOverrideMap))),
    atribuidoA:        uniqueVals(tarefas.map(t => getTarefaFieldValue(t, 'Atribuído a', fieldOverrideMap))),
    responsaveis:      uniqueVals(tarefas.map(t => getTarefaFieldValue(t, 'Responsáveis', fieldOverrideMap))),
    uniUsrCriacao:     uniqueVals(tarefas.map(t => getTarefaFieldValue(t, 'Uni/Usr Criação', fieldOverrideMap))),
    categoria:         uniqueVals(tarefas.flatMap(t => getTarefaChips(t, taskChipsMap).map(getTarefaChipLabel))),
  };
}

function tarefaMatchesFilters(tarefa: WorkQueueCard, filters: TarefaQueueFilters, fieldOverrideMap: FieldOverrideMap | null = null, taskChipsMap: Map<string, Chip[]> | null = null): boolean {
  if (filters.tipoTarefa?.size > 0 && !filters.tipoTarefa.has(tarefa.processNumber ?? '')) return false;
  if (filters.situacao?.size > 0) {
    const label = getTarefaSituacaoLabel((tarefa.tarefa as Record<string, unknown>)?.situacao);
    if (!filters.situacao.has(label)) return false;
  }
  if (filters.fluxo?.size > 0) {
    const proc = processosRelacionados.find(p => p.id === tarefa.processoId);
    const possuiFluxo = ((proc?.processo as Record<string, unknown>)?.indicadores as Record<string, unknown>)?.possuiFluxo ?? false;
    const fluxoLabel = possuiFluxo ? 'Possui fluxo' : 'Sem fluxo';
    if (!filters.fluxo.has(fluxoLabel)) return false;
  }
  if (filters.processoDocumento.size > 0 && !filters.processoDocumento.has(tarefa.processClass ?? '')) return false;
  if (filters.classificacao.size > 0) {
    const v = getTarefaFieldValue(tarefa, 'Classificação', fieldOverrideMap);
    if (!v || !filters.classificacao.has(v)) return false;
  }
  if (filters.interessado.size > 0) {
    const v = getTarefaFieldValue(tarefa, 'Interessado', fieldOverrideMap);
    if (!v || !filters.interessado.has(v)) return false;
  }
  if (filters.atribuidoA.size > 0) {
    const v = getTarefaFieldValue(tarefa, 'Atribuído a', fieldOverrideMap);
    if (!v || v === '-' || !filters.atribuidoA.has(v)) return false;
  }
  if (filters.responsaveis.size > 0) {
    const v = getTarefaFieldValue(tarefa, 'Responsáveis', fieldOverrideMap);
    if (!v || !filters.responsaveis.has(v)) return false;
  }
  if (filters.uniUsrCriacao.size > 0) {
    const v = getTarefaFieldValue(tarefa, 'Uni/Usr Criação', fieldOverrideMap);
    if (!v || !filters.uniUsrCriacao.has(v)) return false;
  }
  if (filters.categoria?.size > 0) {
    const ok = getTarefaChips(tarefa, taskChipsMap).some(c => filters.categoria.has(getTarefaChipLabel(c)));
    if (!ok) return false;
  }
  if (filters.dataCriacao?.from || filters.dataCriacao?.to) {
    if (!dateInRange(getTarefaFieldValue(tarefa, 'Data criação', fieldOverrideMap) ?? '', filters.dataCriacao)) return false;
  }
  if (filters.dataPrazo?.from || filters.dataPrazo?.to) {
    if (!dateInRange(getTarefaFieldValue(tarefa, 'Data prazo', fieldOverrideMap) ?? '', filters.dataPrazo)) return false;
  }
  if (filters.dataAtribuicao?.from || filters.dataAtribuicao?.to) {
    if (!dateInRange(getTarefaFieldValue(tarefa, 'Data de atribuição', fieldOverrideMap) ?? '', filters.dataAtribuicao)) return false;
  }
  return true;
}

function tarefaMatchesKeyword(tarefa: WorkQueueCard, term: string, fieldOverrideMap: FieldOverrideMap | null = null): boolean {
  if (textIncludesSearch(tarefa.processNumber, term)) return true;
  if (textIncludesSearch(tarefa.processClass, term))  return true;
  if ([...(tarefa.fields ?? []), ...(tarefa.extraFields ?? [])].some(f => textIncludesSearch(f.value, term))) return true;
  if (Object.values(fieldOverrideMap?.get(tarefa.id) ?? {}).some(v => textIncludesSearch(v, term))) return true;
  return false;
}

// ── FilaDeTarefas ─────────────────────────────────────────────────────────────

interface FilaDeTarefasProps {
  onNavigate?: (page: string) => void;
  onSidebarChange?: (content: ReactNode) => void;
  crossCounts?: unknown;
  onCountsChange?: (counts: unknown) => void;
}

export function FilaDeTarefas({ onNavigate, onSidebarChange, crossCounts, onCountsChange }: FilaDeTarefasProps) {
  const tarefas = useTarefas();
  const {
    externalTags,
    personalTags,
    savePersonalTag,
    deletePersonalTag,
    getChipsMap,
    updateChipsMap,
    countTagUsage,
  } = useCategorias();
  const {
    isTarefaAtribuida,
    atribuirTarefa,
    desatribuirTarefa,
    mergeTarefaAssignment,
    assignmentMap,
  } = useTarefasState();
  const taskChipsMap = getChipsMap('tarefas');
  const setTaskChipsMap = (updater: Map<string, Chip[]> | ((m: Map<string, Chip[]>) => Map<string, Chip[]>)) => updateChipsMap('tarefas', updater);
  const [activeTab,       setActiveTab]       = useState(0);
  const [keyword,         setKeyword]         = useState('');
  const [page,            setPage]            = useState(tarefasConfig.dados.paginacao.page);
  const [pageSize,        setPageSize]        = useState(tarefasConfig.dados.paginacao.pageSize);
  const [filtersOpen,     setFiltersOpen]     = useState(false);
  const [expandedIds,     setExpandedIds]     = useState<Set<string>>(new Set());
  const [checkedIds,      setCheckedIds]      = useState<Set<string>>(new Set());
  const [openedTaskId,    setOpenedTaskId]    = useState<string | null>(null);
  const [closingTaskId,   setClosingTaskId]   = useState<string | null>(null);
  const [returningTaskId, setReturningTaskId] = useState<string | null>(null);
  const [openedProcessId, setOpenedProcessId] = useState<string | null>(null);
  const [openedProcessInitialTab, setOpenedProcessInitialTab] = useState(3);
  const [processDetailForPanel, setProcessDetailForPanel] = useState<ReturnType<typeof processoCardToDetail> | null>(null);
  // Tarefa que originou a abertura do overlay de processo — rastreamento interno
  const [processOverlaySourceTaskId, setProcessOverlaySourceTaskId] = useState<string | null>(null);
  // Card selecionado visualmente sem painel lateral aberto (ex: após retorno de processo)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const closeTaskTimerRef = useRef<number | null>(null);
  const returnTaskTimerRef = useRef<number | null>(null);
  const processPanelCloseTimer = useRef<number | null>(null);
  const [pinnedIds,       setPinnedIds]       = useState<Set<string>>(new Set());
  const [pinOrder,        setPinOrder]        = useState<string[]>([]);
  const [pendingFilters,  setPendingFilters]  = useState<FilterState>(emptyFiltersTarefas());
  const {
    customViews, setCustomViews,
    pinnedSidebarViews, setPinnedSidebarViews,
    activeViewLabel, setActiveViewLabel,
    activeViewBaseFilters: customViewBaseFilters,
    setActiveViewBaseFilters: setCustomViewBaseFilters,
    appliedFilters: ctxAppliedFilters,
    setAppliedFilters,
  } = useCustomViews('tarefas');
  const visualizacao    = activeViewLabel ?? tarefasConfig.controles.visualizacaoValor;
  const setVisualizacao = setActiveViewLabel;
  const appliedFilters  = ctxAppliedFilters ?? emptyFiltersTarefas();
  const {
    customViews: processosCustomViews,
    pinnedSidebarViews: processosPinnedViews,
    setActiveViewLabel: setProcessosActiveViewLabel,
    setActiveViewBaseFilters: setProcessosActiveViewBaseFilters,
    setAppliedFilters: setProcessosAppliedFilters,
  } = useCustomViews('processos');
  const [customViewOpen,     setCustomViewOpen]     = useState(false);
  const [editCustomViewOpen, setEditCustomViewOpen] = useState(false);
  const [editingCustomView,  setEditingCustomView]  = useState<CustomView | null>(null);
  const [personalizacaoOpen,  setPersonalizacaoOpen]  = useState(false);
  const [savedPersonalizacao, setSavedPersonalizacao] = useState(tarefasConfig.defaultPersonalizacaoItems);
  const [createTagOpen,  setCreateTagOpen]  = useState(false);
  const [manageTagsOpen, setManageTagsOpen] = useState(false);
  const [snackbarOpen,    setSnackbarOpen]    = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType,    setSnackbarType]    = useState('warning');
  const [sortField,       setSortField]       = useState(
    () => tarefasConfig.controles.ordenacao.find(s => s.titulo === 'CLASSIFICAR POR')?.itens.find(i => i.selecionado)?.label
       ?? tarefasConfig.controles.ordenacao[0]?.itens[0]?.label ?? ''
  );
  const [sortDirection,   setSortDirection]   = useState(
    () => tarefasConfig.controles.ordenacao.find(s => s.titulo === 'ORDENAR POR')?.itens.find(i => i.selecionado)?.label ?? 'Crescente'
  );
  const [agendadasIds, setAgendadasIds] = useState(
    () => new Set(tarefas.filter(t => t.agendada).map(t => t.id))
  );
  const [agendamentoMap, setAgendamentoMap] = useState<Map<string, string>>(
    () => new Map(tarefas
      .filter(t => t.agendada)
      .map(t => [t.id, t.extraFields?.find(f => f.label === 'Data prazo')?.value ?? ''] as [string, string])
    )
  );
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const [agendamentoMode, setAgendamentoMode] = useState('agendar');
  const [fieldOverrideMap, setFieldOverrideMap] = useState<FieldOverrideMap>(() => {
    const init = new Map<string, Record<string, string>>();
    tarefas.filter(t => t.agendada).forEach(t => {
      const date = t.extraFields?.find(f => f.label === 'Data prazo')?.value ?? '';
      if (date && date !== '-') init.set(t.id, { 'Prazo agendamento': date });
    });
    return init;
  });
  const effectiveFieldOverrideMap = useMemo(() => {
    const next = new Map(fieldOverrideMap);
    assignmentMap.forEach((assignment, id) => {
      next.set(id, {
        ...(next.get(id) ?? {}),
        'Atribuído a': assignment.atribuidoA,
        'Data atribuição': assignment.data,
        'Data de atribuição': assignment.data,
      });
    });
    return next;
  }, [assignmentMap, fieldOverrideMap]);

  const isAtribuida = (tarefa: WorkQueueCard) => isTarefaAtribuida(tarefa.id);
  const getTarefaBgColor = (tarefa: WorkQueueCard) => isAtribuida(tarefa) ? ASSIGNED_TASK_BG : UNASSIGNED_TASK_BG;

  const isAgendadas = visualizacao === 'Tarefas agendadas';
  const isTaskDetailActive = !!openedTaskId;
  const isSidePanelOpen = !!openedTaskId && !returningTaskId;
  const openedTask = tarefas.find(t => t.id === openedTaskId) ?? null;
  const openedTaskAssigned = openedTask ? isAtribuida(openedTask) : false;
  const openedTaskActionStates = {
    criarTarefa: true,
    atribuir:    !!openedTask && !openedTaskAssigned,
    desatribuir: !!openedTask && openedTaskAssigned,
    rejeitar:    false,
    agendar:     !!openedTask,
    editar:      !!openedTask,
    cancelar:    !!openedTask,
  };

  const hasAppliedFilters = customViewBaseFilters
    ? !filtersEqual(appliedFilters, customViewBaseFilters)
    : Object.values(appliedFilters).some(v => v instanceof Set ? v.size > 0 : !!((v as { from?: string | null; to?: string | null } | null)?.from || (v as { from?: string | null; to?: string | null } | null)?.to));

  useEffect(() => () => {
    if (closeTaskTimerRef.current) window.clearTimeout(closeTaskTimerRef.current);
    if (returnTaskTimerRef.current) window.clearTimeout(returnTaskTimerRef.current);
    if (processPanelCloseTimer.current) window.clearTimeout(processPanelCloseTimer.current);
  }, []);

  const closeTransientState = () => {
    setFiltersOpen(false);
    setOpenedTaskId(null);
    setClosingTaskId(null);
    setReturningTaskId(null);
    setOpenedProcessId(null);
    setOpenedProcessInitialTab(3);
    setProcessDetailForPanel(null);
    setCustomViewOpen(false);
    setEditCustomViewOpen(false);
    setEditingCustomView(null);
    setPersonalizacaoOpen(false);
    setCreateTagOpen(false);
    setManageTagsOpen(false);
    setAgendamentoOpen(false);
    setCheckedIds(new Set());
    setExpandedIds(new Set());
    setSelectedTaskId(null);
    setProcessOverlaySourceTaskId(null);
    if (closeTaskTimerRef.current) window.clearTimeout(closeTaskTimerRef.current);
    if (returnTaskTimerRef.current) window.clearTimeout(returnTaskTimerRef.current);
    if (processPanelCloseTimer.current) window.clearTimeout(processPanelCloseTimer.current);
  };

  const navigateFromMenu = (pageName: string) => {
    closeTransientState();
    onNavigate?.(pageName);
  };

  const filteredTarefas = tarefas.filter(tarefa => {
    const agendada = agendadasIds.has(tarefa.id);
    if (isAgendadas  && !agendada) return false;
    if (!isAgendadas &&  agendada) return false;
    if (activeTab === 1 && !isAtribuida(tarefa))  return false;
    if (activeTab === 2 &&  isAtribuida(tarefa))  return false;
    if (keyword && !tarefaMatchesKeyword(tarefa, keyword, effectiveFieldOverrideMap)) return false;
    if ((customViewBaseFilters || hasAppliedFilters) && !tarefaMatchesFilters(tarefa, appliedFilters as TarefaQueueFilters, effectiveFieldOverrideMap, taskChipsMap)) return false;
    return true;
  });

  const viewTarefas = tarefas.filter(t => isAgendadas ? agendadasIds.has(t.id) : !agendadasIds.has(t.id));
  const tabLabels = [
    `Todas (${viewTarefas.length})`,
    `Atribuídas (${viewTarefas.filter(isAtribuida).length})`,
    `Não atribuídas (${viewTarefas.filter(t => !isAtribuida(t)).length})`,
  ];

  const sortedTarefas = [...filteredTarefas].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id);
    const bPinned = pinnedIds.has(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    if (aPinned && bPinned)  return pinOrder.indexOf(a.id) - pinOrder.indexOf(b.id);
    const aVal = parseSortableValue(getSortValue(a, sortField, tarefasConfig.controles.ordenacao));
    const bVal = parseSortableValue(getSortValue(b, sortField, tarefasConfig.controles.ordenacao));
    const cmp  = aVal.localeCompare(bVal);
    return sortDirection === 'Crescente' ? cmp : -cmp;
  });

  const displayedTarefas = sortedTarefas.slice((page - 1) * pageSize, page * pageSize);
  const visibleTarefaIds = displayedTarefas.map(t => t.id);

  const allExpanded = visibleTarefaIds.length > 0 && visibleTarefaIds.every(id => expandedIds.has(id));
  const allChecked  = visibleTarefaIds.length > 0 && visibleTarefaIds.every(id => checkedIds.has(id));

  const toggleExpanded = (id: string) => setExpandedIds(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const toggleAllExpanded = () => setExpandedIds(prev => {
    const n = new Set(prev);
    visibleTarefaIds.forEach(id => { if (allExpanded) n.delete(id); else n.add(id); });
    return n;
  });

  const toggleChecked = (id: string) => setCheckedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAllChecked = () => setCheckedIds(prev => {
    const n = new Set(prev);
    visibleTarefaIds.forEach(id => { if (allChecked) n.delete(id); else n.add(id); });
    return n;
  });

  const moveTarefaToTopByPin = (id: string) => {
    setPinnedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); setPinOrder(o => o.filter(x => x !== id)); }
      else           { n.add(id);    setPinOrder(o => [id, ...o.filter(x => x !== id)]); }
      return n;
    });
  };

  const clearTaskCloseTimer = () => {
    if (closeTaskTimerRef.current) {
      window.clearTimeout(closeTaskTimerRef.current);
      closeTaskTimerRef.current = null;
    }
    if (returnTaskTimerRef.current) {
      window.clearTimeout(returnTaskTimerRef.current);
      returnTaskTimerRef.current = null;
    }
  };

  const closeOpenedTask = () => {
    if (!openedTaskId) return;
    const closingId = openedTaskId;
    setExpandedIds(prev => {
      const n = new Set(prev);
      n.add(closingId);
      return n;
    });
    clearTaskCloseTimer();
    setClosingTaskId(closingId);
    closeTaskTimerRef.current = window.setTimeout(() => {
      setClosingTaskId(current => current === closingId ? null : current);
      setReturningTaskId(closingId);
      closeTaskTimerRef.current = null;
      returnTaskTimerRef.current = window.setTimeout(() => {
        setOpenedTaskId(current => current === closingId ? null : current);
        setReturningTaskId(current => current === closingId ? null : current);
        returnTaskTimerRef.current = null;
      }, 200);
    }, 180);
  };

  const openTaskPanel = (id: string) => {
    clearTaskCloseTimer();
    setClosingTaskId(null);
    setReturningTaskId(null);
    setOpenedTaskId(id);
    setSelectedTaskId(null);
    setProcessOverlaySourceTaskId(null);
  };

  const toggleTaskPanel = (id: string) => {
    if (openedTaskId === id && closingTaskId !== id) {
      closeOpenedTask();
      return;
    }
    // Tarefa selecionada sem painel (ex: após retorno de processo) → toggle: deselect e recolhe
    if (selectedTaskId === id && !openedTaskId) {
      setSelectedTaskId(null);
      setExpandedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      return;
    }
    openTaskPanel(id);
  };

  const buildProcessDetail = (processCard: WorkQueueCard) => processoCardToDetail(processCard as unknown as Parameters<typeof processoCardToDetail>[0]);

  const handleOpenProcessFromTarefa = (tarefa: WorkQueueCard) => {
    const processCard = resolveProcessoForTarefa(tarefa as unknown as Parameters<typeof resolveProcessoForTarefa>[0], processosRelacionados as unknown as Parameters<typeof resolveProcessoForTarefa>[1]);
    if (!processCard) {
      showNotification('Processo vinculado não encontrado.', 'warning');
      return;
    }
    // Garante que ao fechar o overlay, a tarefa de origem esteja na página visível
    const taskIdx = sortedTarefas.findIndex(t => t.id === tarefa.id);
    if (taskIdx >= 0) {
      const targetPage = Math.ceil((taskIdx + 1) / pageSize);
      if (targetPage !== page) setPage(targetPage);
    }
    // Fecha painel lateral e limpa seleção visual — overlay cobre a tela inteira
    setOpenedTaskId(null);
    setClosingTaskId(null);
    setReturningTaskId(null);
    setSelectedTaskId(null);
    // Rastreamento interno da tarefa de origem (não drive seleção visual)
    setProcessOverlaySourceTaskId(tarefa.id);
    setExpandedIds(prev => { const n = new Set(prev); n.add(tarefa.id); return n; });
    if (processPanelCloseTimer.current) window.clearTimeout(processPanelCloseTimer.current);
    setProcessDetailForPanel(buildProcessDetail(processCard as unknown as WorkQueueCard));
    setOpenedProcessInitialTab(3);
    setOpenedProcessId((processCard as { id: string }).id);
  };

  const handleCloseProcess = () => {
    const closedProcessId = openedProcessId;
    const sourceTaskId    = processOverlaySourceTaskId;
    setOpenedProcessId(null);
    if (processPanelCloseTimer.current) window.clearTimeout(processPanelCloseTimer.current);
    processPanelCloseTimer.current = window.setTimeout(() => {
      setProcessDetailForPanel(null);
      // Restaura seleção visual e expansão da tarefa de origem, sem reabrir painel
      // (modo normal, sem visualização reduzida)
      if (sourceTaskId) {
        setSelectedTaskId(sourceTaskId);
        setExpandedIds(prev => { const n = new Set(prev); n.add(sourceTaskId); return n; });
      }
      setProcessOverlaySourceTaskId(null);
      // Scroll até a tarefa de origem
      const scrollId = sourceTaskId
        ?? sortedTarefas.find(t => t.processoId === closedProcessId)?.id;
      if (scrollId) {
        document.querySelector(`[data-id="${scrollId}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      processPanelCloseTimer.current = null;
    }, 280);
  };

  const getFields = (tarefa: WorkQueueCard) =>
    resolveDisplayFields(tarefa, savedPersonalizacao, tarefasConfig.personalizacaoItems, effectiveFieldOverrideMap);

  const categoriaItems = [...new Map([
    ...externalTags,
    ...personalTags,
  ].map(c => [c.label, c] as const)).values()];

  const handleApplyTags = (tagStates: Map<string, string>, targetIds: Set<string> = checkedIds) => {
    setTaskChipsMap(prev => {
      const next = new Map(prev);
      targetIds.forEach(id => {
        let chips: Chip[] = [...(next.get(id) ?? [])];
        tagStates.forEach((state, label) => {
          if (state === 'checked') {
            const tag = categoriaItems.find(t => t.label === label);
            if (tag && !chips.some(c => c.label === label)) {
              chips = [...chips, tag];
            }
          } else if (state === 'unchecked') {
            chips = chips.filter(c => c.label !== label);
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

  const handleSaveCustomView = (view: { label: string; filters: FilterState; pinInSidebar: boolean; originalLabel: string | null }) => {
    const newView = { label: view.label, filters: view.filters, pinInSidebar: view.pinInSidebar };
    setCustomViews(prev => [...prev, newView]);
    const baseFx = copyFilters(view.filters);
    setVisualizacao(view.label);
    setCustomViewBaseFilters(baseFx);
    setAppliedFilters(baseFx);
    setPendingFilters(baseFx);
    setActiveTab(0);
    setPage(1);
    if (view.pinInSidebar) setPinnedSidebarViews(prev => [...prev, { label: view.label }]);
    setCustomViewOpen(false);
  };

  const handleSaveEditCustomView = (view: { label: string; filters: FilterState; pinInSidebar: boolean; originalLabel: string | null }) => {
    const updatedView = { label: view.label, filters: view.filters, pinInSidebar: view.pinInSidebar };
    setCustomViews(prev => prev.map(v => v.label === view.originalLabel ? updatedView : v));

    const wasPinned = pinnedSidebarViews.some(v => v.label === view.originalLabel);
    if (wasPinned) {
      if (view.pinInSidebar) {
        setPinnedSidebarViews(prev => prev.map(v => v.label === view.originalLabel ? { label: view.label } : v));
      } else {
        setPinnedSidebarViews(prev => prev.filter(v => v.label !== view.originalLabel));
      }
    } else if (view.pinInSidebar) {
      setPinnedSidebarViews(prev => [...prev, { label: view.label }]);
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
    setCustomViews(prev => prev.filter(v => v.label !== label));
    setPinnedSidebarViews(prev => prev.filter(v => v.label !== label));
    if (visualizacao === label) {
      setVisualizacao(tarefasConfig.controles.visualizacaoValor);
      setCustomViewBaseFilters(null);
      setAppliedFilters(emptyFiltersTarefas());
      setPendingFilters(emptyFiltersTarefas());
      setPage(1);
    }
    setEditCustomViewOpen(false);
    setEditingCustomView(null);
  };

  const showNotification = (message: string, type = 'warning') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const handleAtribuir = () => {
    const selected  = tarefas.filter(t => checkedIds.has(t.id));
    const toAtribuir = selected.filter(t => !isAtribuida(t));
    if (toAtribuir.length === 0) {
      showNotification(tarefasConfig.controles.acoes.mensagemJaAtribuidas, 'warning');
      return;
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    const now = new Date();
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    toAtribuir.forEach(t => atribuirTarefa(t.id));
    setFieldOverrideMap(prev => {
      const n = new Map(prev);
      toAtribuir.forEach(t => {
        n.set(t.id, {
          ...(n.get(t.id) ?? {}),
          'Atribuído a': tarefasConfig.controles.usuarioAtribuicao,
          'Data atribuição': dateStr,
          'Data de atribuição': dateStr,
        });
      });
      return n;
    });
    const msg = selected.length > toAtribuir.length
      ? tarefasConfig.controles.acoes.mensagemJaAtribuidas
      : tarefasConfig.controles.acoes.mensagemAtribuidas;
    showNotification(msg, selected.length > toAtribuir.length ? 'warning' : 'success');
    setCheckedIds(new Set());
  };

  const handleDesatribuir = () => {
    const selected     = tarefas.filter(t => checkedIds.has(t.id));
    const toDesatribuir = selected.filter(t => isAtribuida(t));
    if (toDesatribuir.length === 0) {
      showNotification(tarefasConfig.controles.acoes.mensagemJaDesatribuidas, 'warning');
      return;
    }
    toDesatribuir.forEach(t => desatribuirTarefa(t.id));
    setFieldOverrideMap(prev => {
      const n = new Map(prev);
      toDesatribuir.forEach(t => {
        n.set(t.id, {
          ...(n.get(t.id) ?? {}),
          'Atribuído a': '-',
          'Data atribuição': '-',
          'Data de atribuição': '-',
        });
      });
      return n;
    });
    const msg = selected.length > toDesatribuir.length
      ? tarefasConfig.controles.acoes.mensagemJaDesatribuidas
      : tarefasConfig.controles.acoes.mensagemDesatribuidas;
    showNotification(msg, selected.length > toDesatribuir.length ? 'warning' : 'success');
    setCheckedIds(new Set());
  };

  const handleSaveAgendamento = (selectedIds: string[], datesById: Record<string, string>) => {
    setAgendadasIds(prev => {
      const n = new Set(prev);
      selectedIds.forEach(id => n.add(id));
      return n;
    });
    setAgendamentoMap(prev => {
      const n = new Map(prev);
      selectedIds.forEach(id => n.set(id, datesById[id]));
      return n;
    });
    // Nota: a data do agendamento NÃO sobrescreve 'Data prazo' no card.
    // 'Data prazo' vem dos dados básicos da tarefa (definido na criação/edição).
    // agendamentoMap armazena a data para pré-preencher o modal e para 'Prazo agendamento'.
    setFieldOverrideMap(prev => {
      const n = new Map(prev);
      selectedIds.forEach(id => {
        n.set(id, { ...(n.get(id) ?? {}), 'Prazo agendamento': datesById[id] });
      });
      return n;
    });
    setTaskChipsMap(prev => {
      const n = new Map(prev);
      selectedIds.forEach(id => {
        const chips = [...(n.get(id) ?? [])];
        if (!hasSystemChip(chips, SYSTEM_TAGS.INICIO_AGENDADO)) {
          chips.push(systemChip(SYSTEM_TAGS.INICIO_AGENDADO));
        }
        n.set(id, chips);
      });
      return n;
    });
    setPage(1);
    setCheckedIds(new Set(selectedIds));
    setActiveTab(0);
    setVisualizacao('Tarefas agendadas');
    setAgendamentoOpen(false);
    setTimeout(() => {
      document.querySelector(`[data-id="${selectedIds[0]}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  };

  const handleRemoveAgendamento = (selectedIds: string[]) => {
    setAgendadasIds(prev => {
      const n = new Set(prev);
      selectedIds.forEach(id => n.delete(id));
      return n;
    });
    setAgendamentoMap(prev => {
      const n = new Map(prev);
      selectedIds.forEach(id => n.delete(id));
      return n;
    });
    setFieldOverrideMap(prev => {
      const n = new Map(prev);
      selectedIds.forEach(id => {
        const current = { ...(n.get(id) ?? {}) };
        delete current['Prazo agendamento'];
        n.set(id, current);
      });
      return n;
    });
    setTaskChipsMap(prev => {
      const n = new Map(prev);
      selectedIds.forEach(id => {
        n.set(id, removeSystemChip(n.get(id) ?? [], SYSTEM_TAGS.INICIO_AGENDADO));
      });
      return n;
    });
    setPage(1);
    setCheckedIds(new Set(selectedIds));
    setActiveTab(0);
    setVisualizacao(tarefasConfig.controles.visualizacaoValor);
    setCustomViewBaseFilters(null);
    setAppliedFilters(emptyFiltersTarefas());
    setPendingFilters(emptyFiltersTarefas());
    setAgendamentoOpen(false);
    setTimeout(() => {
      document.querySelector(`[data-id="${selectedIds[0]}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  };

  const handleOpenFilters  = () => { setPendingFilters(copyFilters(appliedFilters)); setFiltersOpen(true); };
  const handleSaveFilters  = () => { setAppliedFilters(copyFilters(pendingFilters)); setFiltersOpen(false); setPage(1); };
  const handleCloseFilters = () => setFiltersOpen(false);
  const handleClearApplied = () => {
    const base = customViewBaseFilters ? copyFilters(customViewBaseFilters) : emptyFiltersTarefas();
    setAppliedFilters(base);
    setPendingFilters(base);
    setPage(1);
  };

  const customViewTarefas = customViewBaseFilters
    ? viewTarefas.filter(t => tarefaMatchesFilters(t, customViewBaseFilters as TarefaQueueFilters, effectiveFieldOverrideMap, taskChipsMap))
    : viewTarefas;
  const filterOptions    = getDerivedFilterOptionsTarefas(customViewTarefas, effectiveFieldOverrideMap, taskChipsMap);
  const allFilterOptions = getDerivedFilterOptionsTarefas(viewTarefas,       effectiveFieldOverrideMap, taskChipsMap);

  const hasSelection    = checkedIds.size > 0;
  const showAtribuir    = !isAgendadas && activeTab !== 1;
  const showDesatribuir = !isAgendadas && activeTab !== 2;
  const showRejeitar    = !isAgendadas && activeTab !== 1;
  const selectedTarefas = tarefas.filter(t => checkedIds.has(t.id));
  const unassignedOnlyEligibility = getBulkActionEligibility(
    selectedTarefas,
    tarefa => !isAtribuida(tarefa),
    'all',
  );
  const unassignedOnlyActionHint = (label: string) =>
    hasSelection && !unassignedOnlyEligibility.canRun
      ? tarefasConfig.controles.acoes.mensagemSelecaoApenasNaoAtribuidas
      : label;

  const ordenacaoSections = tarefasConfig.controles.ordenacao.map(secao => {
    const isDir = secao.titulo === 'ORDENAR POR';
    return {
      title: secao.titulo,
      items: secao.itens.map(item => ({
        label:    item.label,
        selected: isDir ? item.label === sortDirection : item.label === sortField,
        onClick:  isDir ? () => { setSortDirection(item.label); setPage(1); } : () => { setSortField(item.label); setPage(1); },
      })),
    };
  });

  const sidebarContent = useMemo(() => (
    <>
      {sidebarCategoriasConfig.dados.secoes.map((secao, si) => {
        const isProcessosSection = secao.titulo === 'Processos/Documentos';
        const isTarefasSection   = secao.titulo === 'Tarefas';
        return (
          <SideMenuSection key={si} title={secao.titulo}>
            {secao.itens.map((item, ii) => {
              if (isTarefasSection) {
                return (
                  <SideMenuItem
                    key={ii}
                    label={item.label}
                    count={tarefas.filter(t =>
                      item.label === 'Tarefas agendadas' ? agendadasIds.has(t.id) : !agendadasIds.has(t.id)
                    ).length}
                    state={item.label === visualizacao ? 'active' : 'default'}
                    showFavIcon={false}
                    onClick={() => {
                      closeTransientState();
                      setVisualizacao(item.label);
                      setActiveTab(0);
                      setPage(1);
                      setCustomViewBaseFilters(null);
                      setAppliedFilters(emptyFiltersTarefas());
                      setPendingFilters(emptyFiltersTarefas());
                    }}
                  />
                );
              }
              if (isProcessosSection) {
                return (
                  <SideMenuItem
                    key={ii}
                    label={item.label}
                    count={item.label === 'Fora da fila de trabalho'
                      ? ((crossCounts as { especial?: number; normal?: number } | null)?.especial ?? item.count)
                      : ((crossCounts as { especial?: number; normal?: number } | null)?.normal   ?? item.count)}
                    state="default"
                    showFavIcon={false}
                    onClick={() => {
                      setProcessosActiveViewLabel(item.label);
                      setProcessosActiveViewBaseFilters(null);
                      setProcessosAppliedFilters(null);
                      navigateFromMenu('processos');
                    }}
                  />
                );
              }
              return (
                <SideMenuItem
                  key={ii}
                  label={item.label}
                  count={item.count}
                  state="default"
                  showFavIcon={false}
                  onClick={closeTransientState}
                />
              );
            })}
            {isTarefasSection && pinnedSidebarViews.map((v, i) => {
              const cv = customViews.find(c => c.label === v.label);
              return (
                <SideMenuItem
                  key={`tv-${i}`}
                  label={v.label}
                  count={(() => {
                    const base = tarefas.filter(t => !agendadasIds.has(t.id));
                    if (!cv) return base.length;
                    return base.filter(t => tarefaMatchesFilters(t, (cv.filters ?? emptyFiltersTarefas()) as TarefaQueueFilters, effectiveFieldOverrideMap, taskChipsMap)).length;
                  })()}
                  state={v.label === visualizacao ? 'active' : 'default'}
                  showFavIcon={false}
                  onClick={() => {
                    closeTransientState();
                    setVisualizacao(v.label);
                    setActiveTab(0);
                    setPage(1);
                    if (cv) {
                      const baseFx = copyFilters(cv.filters ?? emptyFiltersTarefas());
                      setCustomViewBaseFilters(baseFx);
                      setAppliedFilters(baseFx);
                      setPendingFilters(baseFx);
                    }
                  }}
                />
              );
            })}
            {isProcessosSection && processosPinnedViews.map((v, i) => {
              const cv = processosCustomViews.find(c => c.label === v.label);
              return (
                <SideMenuItem
                  key={`ppv-${i}`}
                  label={v.label}
                  count={(crossCounts as { customViewCounts?: Record<string, number> } | null)?.customViewCounts?.[v.label]}
                  state="default"
                  showFavIcon={false}
                  onClick={() => {
                    if (cv) {
                      const baseFx = copyFilters(cv.filters ?? emptyFiltersTarefas());
                      setProcessosActiveViewLabel(v.label);
                      setProcessosActiveViewBaseFilters(baseFx);
                      setProcessosAppliedFilters(baseFx);
                    } else {
                      setProcessosActiveViewLabel(v.label);
                      setProcessosActiveViewBaseFilters(null);
                      setProcessosAppliedFilters(null);
                    }
                    navigateFromMenu('processos');
                  }}
                />
              );
            })}
          </SideMenuSection>
        );
      })}
    </>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [agendadasIds, visualizacao, pinnedSidebarViews, customViews, processosPinnedViews, processosCustomViews, tarefas, effectiveFieldOverrideMap, taskChipsMap, crossCounts]);

  useEffect(() => {
    onSidebarChange?.(sidebarContent);
  }, [sidebarContent, onSidebarChange]);

  useEffect(() => {
    onCountsChange?.({
      normal:   tarefas.filter(t => !agendadasIds.has(t.id)).length,
      especial: agendadasIds.size,
    });
  }, [tarefas, agendadasIds, onCountsChange]);

  const categoriasSlot = (
    <CategoriasDropdown
      items={categoriaItems}
      iconTooltips={tarefasConfig.controles.categoriasDropdown.tooltipIcones}
      acoes={tarefasConfig.controles.categoriasDropdown.acoes}
      checkedIds={checkedIds}
      processChipsMap={taskChipsMap}
      onApplyTags={handleApplyTags}
      onCreateTag={() => setCreateTagOpen(true)}
      onManageTags={() => setManageTagsOpen(true)}
      hint={tarefasConfig.controles.acoes.categorias}
      label="Marcadores"
    />
  );

  const actionSlot = (
    <>
      {/* Atribuir — tbtn-blue: ícone + label */}
      {showAtribuir && (
        <ButtonHint
          icon={<CallReceivedIcon />}
          label={tarefasConfig.controles.acoes.atribuir}
          variant="blue"
          hint={tarefasConfig.controles.acoes.atribuir}
          disabled={!hasSelection}
          onClick={handleAtribuir}
        />
      )}
      {/* Desatribuir / Rejeitar / Agendar — ícone só */}
      {showDesatribuir && (
        <ButtonHint
          icon={<ArrowOutwardIcon />}
          hint={tarefasConfig.controles.acoes.desatribuir}
          disabled={!hasSelection}
          onClick={handleDesatribuir}
        />
      )}
      {showRejeitar && (
        <ButtonHint
          icon={<CancelIcon />}
          hint={unassignedOnlyActionHint(tarefasConfig.controles.acoes.rejeitar)}
          disabled={!unassignedOnlyEligibility.canRun}
        />
      )}
      <ButtonHint
        icon={<HistoryIcon />}
        hint={isAgendadas ? tarefasConfig.controles.acoes.reagendar : tarefasConfig.controles.acoes.agendar}
        disabled={!hasSelection}
        onClick={() => {
          setAgendamentoMode(isAgendadas ? 'reagendar' : 'agendar');
          setAgendamentoOpen(true);
        }}
      />
    </>
  );

  const openedProcessCard = openedProcessId
    ? processosRelacionados.find(proc => proc.id === openedProcessId)
    : null;
  const openedProcessDetail = openedProcessCard
    ? buildProcessDetail(openedProcessCard)
    : processDetailForPanel;

  // Lista de processos únicos na ordem das tarefas visíveis — respeita filtros e ordenação.
  // Deduplica por processoId para que cada processo apareça apenas uma vez.
  const processNavListTarefas = useMemo(() => {
    const seen = new Set<string>();
    return sortedTarefas.reduce<WorkQueueCard[]>((acc, t) => {
      if (!t.processoId || seen.has(t.processoId)) return acc;
      const proc = processosRelacionados.find(p => p.id === t.processoId);
      if (proc) { seen.add(t.processoId); acc.push(proc); }
      return acc;
    }, []);
  }, [sortedTarefas]);

  const tarefaNavIndex = openedProcessId
    ? processNavListTarefas.findIndex(p => p.id === openedProcessId)
    : -1;
  const hasPrevTarefa = tarefaNavIndex > 0;
  const hasNextTarefa = tarefaNavIndex >= 0 && tarefaNavIndex < processNavListTarefas.length - 1;

  const openProcessAndScrollPage = (proc: WorkQueueCard) => {
    if (processPanelCloseTimer.current) window.clearTimeout(processPanelCloseTimer.current);
    // Garante que a página exibida contenha a tarefa correspondente ao fechar
    const taskIdx = sortedTarefas.findIndex(t => t.processoId === proc.id);
    if (taskIdx >= 0) {
      const targetPage = Math.ceil((taskIdx + 1) / pageSize);
      if (targetPage !== page) setPage(targetPage);
      // Atualiza rastreamento interno da tarefa de origem (sem seleção visual durante overlay)
      const correspondingTask = sortedTarefas[taskIdx];
      setProcessOverlaySourceTaskId(correspondingTask.id);
      setSelectedTaskId(null);
      setExpandedIds(prev => { const n = new Set(prev); n.add(correspondingTask.id); return n; });
    }
    setProcessDetailForPanel(buildProcessDetail(proc));
    setOpenedProcessInitialTab(3);
    setOpenedProcessId(proc.id);
  };

  const handleNavPrevTarefa = () => {
    if (!hasPrevTarefa) return;
    openProcessAndScrollPage(processNavListTarefas[tarefaNavIndex - 1]);
  };
  const handleNavNextTarefa = () => {
    if (!hasNextTarefa) return;
    openProcessAndScrollPage(processNavListTarefas[tarefaNavIndex + 1]);
  };

  const renderTarefa = (tarefa: WorkQueueCard) => {
    const procRelacionado = processosRelacionados.find(p => p.id === tarefa.processoId);
    const possuiFluxo     = !!((procRelacionado?.processo as Record<string, unknown>)?.indicadores as Record<string, unknown>)?.possuiFluxo;
    return (
    <AttachmentCardTarefa
      key={tarefa.id}
      taskName={tarefa.processNumber}
      processNumber={tarefa.processClass}
      possuiFluxo={possuiFluxo}
      bgColor={getTarefaBgColor(tarefa)}
      fields={getFields(tarefa).slice(0, 4) as { label?: string; value?: unknown }[]}
      extraFields={getFields(tarefa).slice(4, 8) as { label?: string; value?: unknown }[]}
      chips={taskChipsMap.get(tarefa.id) ?? tarefa.chips ?? []}
      selected={openedTaskId === tarefa.id || selectedTaskId === tarefa.id}
      compact={isTaskDetailActive}
      expanded={!isTaskDetailActive && expandedIds.has(tarefa.id)}
      onExpandClick={() => toggleTaskPanel(tarefa.id)}
      onOpenProcess={() => handleOpenProcessFromTarefa(tarefa)}
      onClick={() => {
        if (isTaskDetailActive || selectedTaskId === tarefa.id) toggleTaskPanel(tarefa.id);
        else toggleExpanded(tarefa.id);
      }}
      checked={checkedIds.has(tarefa.id)}
      onCheckedChange={e => { e.stopPropagation(); toggleChecked(tarefa.id); }}
      pinned={pinnedIds.has(tarefa.id)}
      onPinClick={() => moveTarefaToTopByPin(tarefa.id)}
    />
    );
  };

  return (
    <>
      <WorkQueue
        texts={tarefasConfig.textos}
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setPage(1); setCheckedIds(new Set()); }}
        tabLabels={tabLabels}
        allChecked={allChecked}
        onToggleAllChecked={toggleAllChecked}
        allExpanded={allExpanded}
        onToggleAllExpanded={toggleAllExpanded}
        ordenacaoSections={ordenacaoSections}
        visualizacao={visualizacao}
        visualizacaoOptions={tarefasConfig.controles.visualizacaoOpcoes}
        customViews={customViews}
        onCreateCustomView={() => setCustomViewOpen(true)}
        onEditCustomView={(label) => {
          const cv = customViews.find(v => v.label === label);
          if (cv) { setEditingCustomView(cv); setEditCustomViewOpen(true); }
        }}
        onVisualizacaoChange={(label) => {
          setVisualizacao(label);
          setActiveTab(0);
          setPage(1);
          setCheckedIds(new Set());
          const cv = customViews.find(v => v.label === label);
          if (cv) {
            const baseFx = copyFilters(cv.filters ?? emptyFiltersTarefas());
            setCustomViewBaseFilters(baseFx);
            setAppliedFilters(baseFx);
            setPendingFilters(baseFx);
          } else {
            setCustomViewBaseFilters(null);
            setAppliedFilters(emptyFiltersTarefas());
            setPendingFilters(emptyFiltersTarefas());
          }
        }}
        keyword={keyword}
        onKeywordChange={e => { setKeyword(e.target.value); setPage(1); }}
        onOpenFilters={handleOpenFilters}
        hasAppliedFilters={hasAppliedFilters}
        onClearAppliedFilters={handleClearApplied}
        filteredCount={filteredTarefas.length}
        resultChipColor={tarefasConfig.controles.chipResultadosCor as 'primary' | 'warning' | 'success' | 'surface' | 'error' | 'support'}
        actionSlot={actionSlot}
        categoriasSlot={categoriasSlot}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 15, 20]}
        onPageChange={(p) => { setPage(p); setCheckedIds(new Set()); }}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); setCheckedIds(new Set()); }}
        displayedItems={displayedTarefas}
        emptyMessage="Nenhuma tarefa encontrada."
        renderItem={renderTarefa}
        sidePanelOpen={isSidePanelOpen}
        sidePanel={(
          <TarefaDetalhePanel
            tarefa={(openedTask ? mergeTarefaAssignment(openedTask as unknown as Tarefa) : null) as unknown as Record<string, unknown> | undefined}
            chips={openedTask ? (taskChipsMap.get(openedTask.id) ?? openedTask.chips ?? []) : []}
            actionLabels={tarefasConfig.controles.acoes}
            actionStates={openedTaskActionStates}
            closing={closingTaskId === openedTask?.id}
            categoriasAction={openedTask ? (
              <CategoriasDropdown
                items={categoriaItems}
                iconTooltips={tarefasConfig.controles.categoriasDropdown.tooltipIcones}
                acoes={tarefasConfig.controles.categoriasDropdown.acoes}
                checkedIds={new Set([openedTask.id])}
                processChipsMap={taskChipsMap}
                onApplyTags={(tagStates) => handleApplyTags(tagStates, new Set([openedTask.id]))}
                onCreateTag={() => setCreateTagOpen(true)}
                onManageTags={() => setManageTagsOpen(true)}
                hint={tarefasConfig.controles.acoes.categorias}
              />
            ) : null}
            onClose={closeOpenedTask}
          />
        )}
        overlayPanelOpen={!!openedProcessId}
        overlayOnClose={handleCloseProcess}
        overlayPanel={(
          <ProcessoDetalhePanel
            processo={openedProcessDetail as unknown as Record<string, unknown>}
            onClose={handleCloseProcess}
            initialTab={openedProcessInitialTab}
            onPrev={handleNavPrevTarefa}
            onNext={handleNavNextTarefa}
            hasPrev={hasPrevTarefa}
            hasNext={hasNextTarefa}
            origin={{ label: tarefasConfig.textos.titulo }}
          />
        )}
        onOpenPersonalizacao={() => setPersonalizacaoOpen(true)}
        onRefresh={() => {}}
      />

      <PersonalizarCardsModal
        open={personalizacaoOpen}
        onClose={() => setPersonalizacaoOpen(false)}
        onSave={(newItems) => { setSavedPersonalizacao(newItems); setPersonalizacaoOpen(false); }}
        savedItems={savedPersonalizacao}
        defaultItems={tarefasConfig.defaultPersonalizacaoItems}
        allItems={tarefasConfig.personalizacaoItems}
        config={tarefasConfig.modalPersonalizarCards}
      />
      <FiltersModal
        open={filtersOpen}
        onClose={handleCloseFilters}
        pendingFilters={pendingFilters}
        onPendingChange={setPendingFilters}
        onSave={handleSaveFilters}
        lockedFilters={customViewBaseFilters ?? undefined}
        filterOptions={filterOptions}
        grupos={tarefasConfig.modalFiltros.dados.grupos}
        ddRows={tarefasConfig.modalFiltros.dados.ddRows}
        ddColCount={tarefasConfig.modalFiltros.dados.ddColCount}
        ddLabels={tarefasConfig.modalFiltros.dados.ddLabels}
        dateRangeRows={tarefasConfig.modalFiltros.dados.dateRangeRows}
        dateRangeLabels={tarefasConfig.modalFiltros.dados.dateRangeLabels}
        emptyFiltersFactory={emptyFiltersTarefas}
      />
      <CriarTagModal
        open={createTagOpen}
        onClose={() => setCreateTagOpen(false)}
        onSave={tag => handleSaveTag(tag)}
        existingLabels={personalTags.map(t => t.label)}
      />
      <GerenciarTagsModal
        open={manageTagsOpen}
        onClose={() => setManageTagsOpen(false)}
        tags={personalTags as unknown as Record<string, unknown>[]}
        onSaveTag={handleSaveTag}
        onDeleteTag={handleDeleteTag}
        countTagUsage={countTagUsage}
      />
      <TarefaAgendamentoModal
        open={agendamentoOpen}
        onClose={() => setAgendamentoOpen(false)}
        mode={agendamentoMode}
        tarefas={selectedTarefas}
        agendamentoMap={agendamentoMap}
        config={tarefasConfig.modalAgendamento}
        onSave={handleSaveAgendamento}
        onRemoveScheduling={handleRemoveAgendamento}
      />
      <VisualizacaoPersonalizadaModal
        open={customViewOpen}
        onClose={() => setCustomViewOpen(false)}
        onSave={handleSaveCustomView}
        filterOptions={allFilterOptions}
        existingLabels={[...tarefasConfig.controles.visualizacaoOpcoes.map(v => v.label), ...customViews.map(v => v.label)]}
        grupos={tarefasConfig.modalFiltros.dados.grupos}
        ddRows={tarefasConfig.modalFiltros.dados.ddRows}
        ddColCount={tarefasConfig.modalFiltros.dados.ddColCount}
        ddLabels={tarefasConfig.modalFiltros.dados.ddLabels}
        dateRangeRows={tarefasConfig.modalFiltros.dados.dateRangeRows}
        dateRangeLabels={tarefasConfig.modalFiltros.dados.dateRangeLabels}
        emptyFiltersFactory={emptyFiltersTarefas}
      />
      <VisualizacaoPersonalizadaModal
        open={editCustomViewOpen}
        onClose={() => { setEditCustomViewOpen(false); setEditingCustomView(null); }}
        onSave={handleSaveEditCustomView}
        onDelete={handleDeleteCustomView}
        filterOptions={allFilterOptions}
        existingLabels={[...tarefasConfig.controles.visualizacaoOpcoes.map(v => v.label), ...customViews.map(v => v.label)]}
        initialView={editingCustomView}
        grupos={tarefasConfig.modalFiltros.dados.grupos}
        ddRows={tarefasConfig.modalFiltros.dados.ddRows}
        ddColCount={tarefasConfig.modalFiltros.dados.ddColCount}
        ddLabels={tarefasConfig.modalFiltros.dados.ddLabels}
        dateRangeRows={tarefasConfig.modalFiltros.dados.dateRangeRows}
        dateRangeLabels={tarefasConfig.modalFiltros.dados.dateRangeLabels}
        emptyFiltersFactory={emptyFiltersTarefas}
      />
      {snackbarOpen && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          <Snackbar type={snackbarType as 'warning' | 'error' | 'support' | 'success'} tone="light" message={snackbarMessage} onClose={() => setSnackbarOpen(false)} />
        </div>
      )}
    </>
  );
}
