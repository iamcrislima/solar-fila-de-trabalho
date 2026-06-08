import { createContext, useCallback, useContext } from 'react';
import type { FilterState } from '@/domain/filtros/filterModel';

export type QueueKey = 'processos' | 'tarefas';

// Visualização personalizada salva pelo usuário. Campos extras tolerados via index
// signature, pois o conteúdo é montado pelas páginas que consomem o provider.
export interface CustomView {
  label: string;
  filters?: FilterState;
  personalizacao?: string[];
  pinInSidebar?: boolean;
}

export type Updater<T> = T | ((prev: T) => T);

export interface CustomViewsContextValue {
  getViews: (queueKey: QueueKey) => CustomView[];
  setViews: (queueKey: QueueKey, updater: Updater<CustomView[]>) => void;
  getPinnedSidebarViews: (queueKey: QueueKey) => CustomView[];
  setPinnedSidebarViews: (queueKey: QueueKey, updater: Updater<CustomView[]>) => void;
  getActiveViewLabel: (queueKey: QueueKey) => string | null;
  setActiveViewLabel: (queueKey: QueueKey, label: string | null) => void;
  getActiveViewBaseFilters: (queueKey: QueueKey) => FilterState | null;
  setActiveViewBaseFilters: (queueKey: QueueKey, filters: FilterState | null) => void;
  getAppliedFilters: (queueKey: QueueKey) => FilterState | null;
  setAppliedFilters: (queueKey: QueueKey, updater: Updater<FilterState | null>) => void;
}

export const CustomViewsContext = createContext<CustomViewsContextValue | null>(null);

export function useCustomViews(queueKey: QueueKey) {
  const ctx = useContext(CustomViewsContext);
  if (!ctx) throw new Error('useCustomViews must be used inside CustomViewsProvider');

  const customViews      = ctx.getViews(queueKey);
  const setCustomViews   = useCallback((updater: Updater<CustomView[]>) => ctx.setViews(queueKey, updater), [ctx, queueKey]);

  const pinnedSidebarViews    = ctx.getPinnedSidebarViews(queueKey);
  const setPinnedSidebarViews = useCallback((updater: Updater<CustomView[]>) => ctx.setPinnedSidebarViews(queueKey, updater), [ctx, queueKey]);

  const activeViewLabel    = ctx.getActiveViewLabel(queueKey);
  const setActiveViewLabel = useCallback((label: string | null) => ctx.setActiveViewLabel(queueKey, label), [ctx, queueKey]);

  const activeViewBaseFilters    = ctx.getActiveViewBaseFilters(queueKey);
  const setActiveViewBaseFilters = useCallback((filters: FilterState | null) => ctx.setActiveViewBaseFilters(queueKey, filters), [ctx, queueKey]);

  const appliedFilters    = ctx.getAppliedFilters(queueKey);
  const setAppliedFilters = useCallback((updater: Updater<FilterState | null>) => ctx.setAppliedFilters(queueKey, updater), [ctx, queueKey]);

  return {
    customViews, setCustomViews,
    pinnedSidebarViews, setPinnedSidebarViews,
    activeViewLabel, setActiveViewLabel,
    activeViewBaseFilters, setActiveViewBaseFilters,
    appliedFilters, setAppliedFilters,
  };
}
