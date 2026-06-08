import { TAREFA_FIELD_DEFS } from '../fields/tarefaQueueFields';
import type { CardField, WorkQueueCard } from '../types';
import type { Chip } from '@/domain/shared.types';

function readPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => (acc as Record<string, unknown>)?.[key], obj);
}

function toDisplayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function buildField(tarefa: Record<string, unknown>, field: Record<string, unknown>): CardField {
  return {
    label: field.label as string,
    value: toDisplayValue(readPath(tarefa, (field.path as string))),
    fieldId: field.fieldId as string,
    aliases: (field.previousLabels as string[] | undefined) ?? [],
  };
}

export function tarefaToWorkQueueCard(tarefa: Record<string, unknown>): WorkQueueCard {
  const fields = TAREFA_FIELD_DEFS
    .filter(field => field.cardArea === 'fields')
    .map(field => buildField(tarefa, field));

  const extraFields = TAREFA_FIELD_DEFS
    .filter(field => field.cardArea === 'extraFields')
    .map(field => buildField(tarefa, field));

  return {
    id: tarefa.id as string,
    processoId: tarefa.processoId as string,
    processoNumero: (tarefa.processo as Record<string, unknown>)?.numero as string,
    processNumber: (tarefa as Record<string, unknown>).titulo as string,
    processClass: (tarefa.processo as Record<string, unknown>)?.numero as string,
    tarefa,
    status: (tarefa.statusAtribuicao ?? tarefa.status) as string,
    agendada: !!(tarefa.agendamento as Record<string, unknown>)?.agendada,
    fields,
    extraFields,
    chips: (tarefa.chips as Chip[]) ?? [],
    documentCount: ((tarefa.indicadores as Record<string, unknown>)?.documentCount as number) ?? 0,
    alertActive: !!(tarefa.indicadores as Record<string, unknown>)?.alertActive,
  };
}

export function tarefasToWorkQueueCards(tarefas: Record<string, unknown>[]): WorkQueueCard[] {
  return tarefas.map(tarefaToWorkQueueCard);
}
