import { getTarefasVisiveis } from '../../../domain/processos/tarefas/repositories/tarefas.repository';
import { USUARIO_LOGADO_MOCK } from '../../../domain/usuario/usuario.mock';
import { tarefasToWorkQueueCards } from '../adapters/tarefaToWorkQueue.adapter';
import {
  TAREFA_FIELD_DEFS,
  findTaskFieldByFilterKey,
  findTaskFieldByLabel,
} from '../fields/tarefaQueueFields';
import type { CardField, FieldOverrideMap, WorkQueueCard } from '../types';

export function getTarefasWorkQueueCards(): WorkQueueCard[] {
  return tarefasToWorkQueueCards(getTarefasVisiveis(USUARIO_LOGADO_MOCK.nome, USUARIO_LOGADO_MOCK.unidade) as unknown as Record<string, unknown>[]);
}

function findCardField(card: WorkQueueCard, field: Record<string, unknown>): CardField | undefined {
  const labels = [(field.label as string), ...((field.previousLabels as string[] | undefined) ?? [])];
  return [...card.fields, ...card.extraFields].find(item =>
    item.fieldId === field.fieldId || labels.includes(item.label)
  );
}

export function getTaskCardFieldValue(card: WorkQueueCard, labelOrFilterKey: string, fieldOverrideMap: FieldOverrideMap | null = null): string | undefined {
  const field = findTaskFieldByFilterKey(labelOrFilterKey)
    ?? findTaskFieldByLabel(labelOrFilterKey)
    ?? TAREFA_FIELD_DEFS.find(item => item.fieldId === labelOrFilterKey);

  const labels = field ? [field.label, ...(field.previousLabels ?? [])] : [labelOrFilterKey];
  const overrides = fieldOverrideMap?.get(card.id);
  const overrideKey = labels.find(label => overrides?.[label] !== undefined);
  if (overrideKey) return overrides?.[overrideKey];

  const found = field
    ? findCardField(card, field)
    : [...card.fields, ...card.extraFields].find(item => labels.includes(item.label));

  return found?.value;
}

export function getTaskSourceByCard(card: WorkQueueCard): Record<string, unknown> | null {
  return card?.tarefa ?? null;
}
