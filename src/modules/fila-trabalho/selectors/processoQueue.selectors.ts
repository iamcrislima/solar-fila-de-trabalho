import { getProcessosEmAndamento } from '../../../domain/processos/repositories/processos.repository';
import { USUARIO_LOGADO_MOCK }     from '../../../domain/usuario/usuario.mock';
import { processosToWorkQueueCards } from '../adapters/processoToWorkQueue.adapter';
import {
  PROCESSO_FIELD_DEFS,
  findProcessFieldByFilterKey,
  findProcessFieldByLabel,
} from '../fields/processoQueueFields';
import type { CardField, FieldOverrideMap, WorkQueueCard } from '../types';

function findCardField(card: WorkQueueCard, field: Record<string, unknown>): CardField | undefined {
  const labels = [(field.label as string), ...((field.previousLabels as string[] | undefined) ?? [])];
  return [...card.fields, ...card.extraFields].find(item =>
    item.fieldId === field.fieldId || labels.includes(item.label)
  );
}

export function getProcessosWorkQueueCards(): WorkQueueCard[] {
  return processosToWorkQueueCards(getProcessosEmAndamento(USUARIO_LOGADO_MOCK.nome, USUARIO_LOGADO_MOCK.unidade) as unknown as Record<string, unknown>[]);
}

export function getProcessCardFieldValue(card: WorkQueueCard, labelOrFilterKey: string, fieldOverrideMap: FieldOverrideMap | null = null): string | undefined {
  const field = findProcessFieldByFilterKey(labelOrFilterKey)
    ?? findProcessFieldByLabel(labelOrFilterKey)
    ?? PROCESSO_FIELD_DEFS.find(item => item.fieldId === labelOrFilterKey);

  const labels = field ? [field.label, ...(field.previousLabels ?? [])] : [labelOrFilterKey];
  const overrides = fieldOverrideMap?.get(card.id);
  const overrideKey = labels.find(label => overrides?.[label] !== undefined);
  if (overrideKey) return overrides?.[overrideKey];

  const found = field
    ? findCardField(card, field)
    : [...card.fields, ...card.extraFields].find(item => labels.includes(item.label));

  return found?.value;
}

export function getProcessDigitalByCard(card: WorkQueueCard): Record<string, unknown> | null {
  return card?.processo ?? null;
}
