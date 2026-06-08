// ─── Utilitários compartilhados — Work Queue ─────────────────────────────────
// Funções puras reutilizadas em FilaDeProcessos e FilaDeTarefas.
// Funções genéricas de busca/normalização vivem em filterUtils — re-exportadas
// aqui para que os importadores existentes não precisem mudar.

export {
  isPresentFilterValue,
  normalizeSearchText,
  textIncludesSearch,
  parseSortableValue,
} from '@/shared/utils/filterUtils';

import { isPresentFilterValue } from '@/shared/utils/filterUtils';

export type BulkActionEligibilityMode = 'partial' | 'all';

export interface BulkActionEligibility<T> {
  selected: T[];
  eligible: T[];
  ineligible: T[];
  hasSelection: boolean;
  hasEligible: boolean;
  hasIneligible: boolean;
  isMixedSelection: boolean;
  canRun: boolean;
}

export function getBulkActionEligibility<T>(
  selected: T[],
  isEligible: (item: T) => boolean,
  mode: BulkActionEligibilityMode,
): BulkActionEligibility<T> {
  const eligible = selected.filter(isEligible);
  const ineligible = selected.filter((item) => !isEligible(item));
  const hasSelection = selected.length > 0;
  const hasEligible = eligible.length > 0;
  const hasIneligible = ineligible.length > 0;

  return {
    selected,
    eligible,
    ineligible,
    hasSelection,
    hasEligible,
    hasIneligible,
    isMixedSelection: hasEligible && hasIneligible,
    canRun: mode === 'partial'
      ? hasSelection
      : hasSelection && !hasIneligible,
  };
}

export function copyFilters(f: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k in f) {
    const v = f[k];
    out[k] = v instanceof Set ? new Set(v) : (v && typeof v === 'object' ? { ...v } : v);
  }
  return out;
}

export function uniqueVals(arr: unknown[]): string[] {
  return ([...new Set(arr.filter(isPresentFilterValue))].sort()) as string[];
}

export const normalizeChipLabel = (label: string): string =>
  label.replace(/\s*\(\d+\/\d+\)\s*$/, '').trim();

// getSortValue — retorna o valor de ordenação de um item dado o label do campo.
// @param item           — processo ou tarefa
// @param fieldLabel     — label selecionado no dropdown de ordenação
// @param ordenacaoConfig — config.controles.ordenacao (array de seções)
export function getSortValue(item: Record<string, unknown>, fieldLabel: string, ordenacaoConfig: unknown[]): string {
  const classificarPor = (ordenacaoConfig as Array<Record<string, unknown>>).find(s => s.titulo === 'CLASSIFICAR POR');
  const itemDef = (classificarPor?.itens as Array<Record<string, unknown>> | undefined)?.find((i: Record<string, unknown>) => i.label === fieldLabel);
  const dataKey = itemDef?.dataKey ?? '';
  if (!dataKey) return '';
  if ((dataKey as string).startsWith('fields:'))      return ((item.fields as Array<Record<string, unknown>>)?.find((f: Record<string, unknown>) => f.label === (dataKey as string).slice(7)) as Record<string, unknown>)?.value as string ?? '';
  if ((dataKey as string).startsWith('extraFields:')) return ((item.extraFields as Array<Record<string, unknown>>)?.find((f: Record<string, unknown>) => f.label === (dataKey as string).slice(12)) as Record<string, unknown>)?.value as string ?? '';
  return String(item[dataKey as string] ?? '');
}

// resolveDisplayFields — monta a lista de campos a exibir no card, na ordem da personalização.
// @param item                 — processo ou tarefa
// @param savedPersonalizacao  — array de IDs na ordem salva
// @param personalizacaoItems  — config.personalizacaoItems (definições de cada campo)
// @param fieldOverrideMap     — opcional; Map<id, {label: value}> para sobrescrever valores
export function resolveDisplayFields(item: Record<string, unknown>, savedPersonalizacao: unknown[], personalizacaoItems: unknown[], fieldOverrideMap: Map<string, unknown> | null = null): unknown[] {
  const baseFields = [...((item.fields as unknown[]) || []), ...((item.extraFields as unknown[]) || [])] as Record<string, unknown>[];
  const overrides  = fieldOverrideMap?.get(item.id as string) as Record<string, unknown> | undefined;
  const allFields: Record<string, unknown>[] = overrides
    ? [
        ...baseFields.map((f: Record<string, unknown>) => overrides[f.label as string] !== undefined ? { ...f, value: overrides[f.label as string] } : f),
        ...Object.entries(overrides)
          .filter(([label]) => !baseFields.some((f: Record<string, unknown>) => f.label === label))
          .map(([label, value]) => ({ label, value })),
      ]
    : baseFields;
  return savedPersonalizacao.map((itemId: unknown) => {
    const itemDef = (personalizacaoItems as Record<string, unknown>[]).find((i: Record<string, unknown>) => i.id === itemId);
    if (!itemDef) return null;
    const found = allFields.find((f: Record<string, unknown>) =>
      (itemDef && itemDef.fieldId !== undefined && f.fieldId === itemDef.fieldId)
      || f.label === (itemDef as Record<string, unknown>)?.dataKey
      || f.label === (itemDef as Record<string, unknown>)?.label
      || ((itemDef as Record<string, unknown>)?.aliases as string[] || []).some((a: string) => f.label === a)
    );
    return { label: found?.label ?? (itemDef as Record<string, unknown>)?.dataKey, value: found?.value ?? '-' };
  }).filter(Boolean);
}
