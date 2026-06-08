// Utilitários puros para o modelo de filtros da aplicação.
// Suporta filtros do tipo Set (checkboxes) e objeto {from, to} (date range).
// Sem dependências de UI — pode ser consumido por qualquer camada.

import type { DateRange } from './dateRange';

type FilterValue = Set<string> | DateRange | null | undefined;
export type FilterState = Record<string, FilterValue>;

export function copyFilters(f: FilterState): FilterState {
  const out: FilterState = {};
  for (const k in f) {
    const v = f[k];
    out[k] = v instanceof Set ? new Set(v) : v && typeof v === 'object' ? { ...v } : v;
  }
  return out;
}

export function filtersEqual(a: FilterState | null, b: FilterState | null): boolean {
  if (!a || !b) return false;
  for (const key of Object.keys(a)) {
    const sa = a[key];
    const sb = b[key];
    if (sa instanceof Set) {
      if (!(sb instanceof Set) || sa.size !== sb.size) return false;
      for (const v of sa) if (!sb.has(v)) return false;
    } else if (sa && typeof sa === 'object') {
      const da = sa as DateRange;
      const db = sb as DateRange | null | undefined;
      if (!db || da.from !== db.from || da.to !== db.to) return false;
    }
  }
  return true;
}

export function hasAppliedFilters(filters: FilterState | null | undefined): boolean {
  if (!filters) return false;
  return Object.values(filters).some((v) =>
    v instanceof Set ? v.size > 0 : !!(v as DateRange | null | undefined)?.from || !!(v as DateRange | null | undefined)?.to
  );
}
