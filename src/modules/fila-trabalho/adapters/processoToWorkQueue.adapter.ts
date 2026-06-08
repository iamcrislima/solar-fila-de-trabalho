import { PROCESSO_FIELD_DEFS } from '../fields/processoQueueFields';
import { getTarefasEmAndamento } from '../../../domain/processos/tarefas/repositories/tarefas.repository';
import { countTarefasAbertasByProcessoId } from '../../../domain/processos/tarefas/selectors/processoTarefa.selectors';
import {
  getProcessoLembretes,
  processoPossuiLembretes,
} from '../../../domain/processos/selectors/processoSelectors';
import type { CardField, StatusAction, WorkQueueCard } from '../types';
import type { Chip } from '@/domain/shared.types';
import type { ProcessoDigital } from '@/domain/processos/models/processoDigital.model';

function readPath(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce((acc: unknown, key: string) => (acc as Record<string, unknown>)?.[key], obj);
}

function toDisplayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function buildField(processo: Record<string, unknown>, field: Record<string, unknown>): CardField {
  return {
    label: field.label as string,
    value: toDisplayValue(readPath(processo, field.path as string)),
    fieldId: field.fieldId as string,
    aliases: (field.previousLabels as string[] | undefined) ?? [],
  };
}

function getStatusActions(
  processo: Record<string, unknown>,
  tarefasAbertasCount: number
): StatusAction[] {
  const isDocumento = processo.tipo === 'Documento';
  const isInterpessoal =
    (processo.tramite as Record<string, unknown>)?.encaminhamento === 'Interpessoal';
  const indicadores = (processo.indicadores ?? {}) as Record<string, unknown>;
  const possuiFluxo = !!(indicadores as Record<string, unknown>).possuiFluxo;
  const possuiLembretes = processoPossuiLembretes(processo as unknown as ProcessoDigital);

  return [
    {
      iconKey: isInterpessoal ? 'person' : 'groups',
      active: true,
      tooltip: isInterpessoal ? 'Encaminhado para mim' : 'Encaminhado para o setor',
    },
    {
      iconKey: isDocumento ? 'insert_drive_file' : 'library_books',
      active: true,
      tooltip: isDocumento ? 'Documento digital' : 'Processo digital',
    },
    {
      iconKey: 'etapas',
      active: possuiFluxo,
      tooltip: possuiFluxo ? 'Possui fluxo' : 'Não possui fluxo',
    },
    {
      iconKey: 'lock',
      active: !!(indicadores as Record<string, unknown>).possuiRestricao,
      tooltip: 'Possui restrição',
    },
    {
      iconKey: 'assignment',
      active: tarefasAbertasCount > 0,
      tooltip: tarefasAbertasCount > 0 ? 'Tarefas em aberto' : 'Sem tarefas em aberto',
    },
    { iconKey: 'warning', active: possuiLembretes, tooltip: 'Lembretes' },
  ];
}

export function processoToWorkQueueCard(processo: Record<string, unknown>): WorkQueueCard {
  const tarefasAbertasCount = countTarefasAbertasByProcessoId(
    processo.id as string,
    getTarefasEmAndamento()
  );
  const fields = PROCESSO_FIELD_DEFS.filter((field) => field.cardArea === 'fields').map((field) =>
    buildField(processo, field)
  );

  const extraFields = PROCESSO_FIELD_DEFS.filter((field) => field.cardArea === 'extraFields').map(
    (field) => buildField(processo, field)
  );

  const fila = processo.fila as Record<string, unknown> | undefined;

  return {
    id: processo.id as string,
    processNumber: processo.numero as string,
    processClass: processo.classificacao as string,
    processo,
    bgColor: processo.bgColor as string,
    foraFila: !!processo.foraFila,
    fimPrazoInterno: (fila?.fimPrazoInterno as string) || undefined,
    fields,
    extraFields,
    chips: (processo.chips as Chip[]) ?? [],
    lembretes: getProcessoLembretes(processo as unknown as ProcessoDigital),
    statusActions: getStatusActions(processo, tarefasAbertasCount),
    documentCount: tarefasAbertasCount,
    alertActive: processoPossuiLembretes(processo as unknown as ProcessoDigital),
  };
}

export function processosToWorkQueueCards(processos: Record<string, unknown>[]): WorkQueueCard[] {
  return processos.map(processoToWorkQueueCard);
}
