// ─── Tipos de domínio — Work Queue (fila de processos e tarefas) ─────────────
// Tipos reais consumidos por adapters → selectors → páginas/modais do módulo.
// Centraliza o "shape" dos cards e dos filtros para dar segurança de tipos real,
// evitando `Record<string, unknown>` espalhado pela camada de apresentação.

import type { Chip } from '@/domain/shared.types';
import type { DateRange } from '@/domain/filtros/dateRange';

// ─── Campo de card ────────────────────────────────────────────────────────────
// Cada card exibe uma lista de campos (label + valor). `fieldId`/`aliases` são
// opcionais porque campos derivados de personalização nem sempre os possuem.
export interface CardField {
  label: string;
  value: string;
  fieldId?: string;
  aliases?: string[];
}

// ─── Ação de status (ícones do cabeçalho do card de processo) ────────────────
export interface StatusAction {
  iconKey: string;
  active: boolean;
  tooltip: string;
  onClick?: () => void;
}

// ─── Card da fila ────────────────────────────────────────────────────────────
// Representa tanto um processo quanto uma tarefa na fila. Os campos comuns
// (id, fields, chips…) são sempre preenchidos; os específicos de cada origem
// (`processo`/`tarefa` e derivados) ficam opcionais.
// Definido como `type` (não `interface`) de propósito: ganha índice implícito e
// continua atribuível a `Record<string, unknown>` consumido por utilitários puros.
export type WorkQueueCard = {
  id: string;
  processNumber?: string;
  processClass?: string;
  /** Origem processo (presente em cards de processo e nos relacionados a tarefas). */
  processo?: Record<string, unknown>;
  /** Origem tarefa (presente apenas em cards de tarefa). */
  tarefa?: Record<string, unknown>;
  processoId?: string;
  processoNumero?: string;
  bgColor?: string;
  foraFila?: boolean;
  /** Prazo interno definido pela ação "Incluir prazo" — pré-preenche o modal "Reagendar prazo". */
  fimPrazoInterno?: string;
  fields: CardField[];
  extraFields: CardField[];
  chips: Chip[];
  lembretes?: unknown[];
  statusActions?: StatusAction[];
  documentCount?: number;
  alertActive?: boolean;
  status?: string;
  agendada?: boolean;
};

// ─── Filtros ─────────────────────────────────────────────────────────────────
// Conjunto de checkboxes (Set) ou intervalo de datas (DateRange) por chave.
export type FilterSet = Set<string>;

/** Filtros da fila de processos (chaves de `emptyFilters` em FiltersModal). */
export type ProcessQueueFilters = {
  tipo: FilterSet;
  natureza: FilterSet;
  encaminhamento: FilterSet;
  fluxo: FilterSet;
  tarefas: FilterSet;
  sigilo: FilterSet;
  processoDocumento: FilterSet;
  classificacao: FilterSet;
  interessado: FilterSet;
  cadastradoPor: FilterSet;
  categoria: FilterSet;
  unidadeEncaminhamento: FilterSet;
  unidadeAtual: FilterSet;
  recebidoPor: FilterSet;
  dataEntrada: DateRange;
  dataEncaminhamento: DateRange;
  prazoEncaminhamento: DateRange;
  recebidoEm: DateRange;
};

/** Filtros da fila de tarefas (chaves de `emptyFiltersTarefas`). */
export type TarefaQueueFilters = {
  tipoTarefa: FilterSet;
  situacao: FilterSet;
  processoDocumento: FilterSet;
  classificacao: FilterSet;
  interessado: FilterSet;
  atribuidoA: FilterSet;
  responsaveis: FilterSet;
  uniUsrCriacao: FilterSet;
  categoria: FilterSet;
  fluxo: FilterSet;
  dataCriacao: DateRange;
  dataPrazo: DateRange;
  dataAtribuicao: DateRange;
};

/** Map opcional de overrides de campos por id de card: `Map<cardId, { label: value }>`. */
export type FieldOverrideMap = Map<string, Record<string, string>>;
