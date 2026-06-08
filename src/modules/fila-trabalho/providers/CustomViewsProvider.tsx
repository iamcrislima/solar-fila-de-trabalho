import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { FilterState } from '@/domain/filtros/filterModel';
import { CustomViewsContext } from './useCustomViews';
import type { CustomView, QueueKey, Updater } from './useCustomViews';

// Persiste o estado de visualizações personalizadas por fila (processos / tarefas)
// enquanto a sessão durar. Resolve o problema de estado ser destruído ao navegar
// entre FilaDeProcessos e FilaDeTarefas.

interface QueueViewsState {
  views: CustomView[];
  pinnedSidebarViews: CustomView[];
  activeViewLabel: string | null;
  activeViewBaseFilters: FilterState | null;
  appliedFilters: FilterState | null;
}

type CustomViewsState = Record<QueueKey, QueueViewsState>;

const emptyQueueState = (): QueueViewsState => ({
  views: [], pinnedSidebarViews: [], activeViewLabel: null, activeViewBaseFilters: null, appliedFilters: null,
});

const INITIAL_STATE: CustomViewsState = {
  processos: emptyQueueState(),
  tarefas:   emptyQueueState(),
};

function resolveUpdater<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater;
}

export function CustomViewsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CustomViewsState>(INITIAL_STATE);

  const getViews = useCallback((queueKey: QueueKey) => state[queueKey]?.views ?? [], [state]);

  const setViews = useCallback((queueKey: QueueKey, updater: Updater<CustomView[]>) => {
    setState(prev => ({
      ...prev,
      [queueKey]: { ...prev[queueKey], views: resolveUpdater(updater, prev[queueKey]?.views ?? []) },
    }));
  }, []);

  const getPinnedSidebarViews = useCallback((queueKey: QueueKey) => state[queueKey]?.pinnedSidebarViews ?? [], [state]);

  const setPinnedSidebarViews = useCallback((queueKey: QueueKey, updater: Updater<CustomView[]>) => {
    setState(prev => ({
      ...prev,
      [queueKey]: { ...prev[queueKey], pinnedSidebarViews: resolveUpdater(updater, prev[queueKey]?.pinnedSidebarViews ?? []) },
    }));
  }, []);

  const getActiveViewLabel = useCallback((queueKey: QueueKey) => state[queueKey]?.activeViewLabel ?? null, [state]);

  const setActiveViewLabel = useCallback((queueKey: QueueKey, label: string | null) => {
    setState(prev => ({ ...prev, [queueKey]: { ...prev[queueKey], activeViewLabel: label } }));
  }, []);

  const getActiveViewBaseFilters = useCallback((queueKey: QueueKey) => state[queueKey]?.activeViewBaseFilters ?? null, [state]);

  const setActiveViewBaseFilters = useCallback((queueKey: QueueKey, filters: FilterState | null) => {
    setState(prev => ({ ...prev, [queueKey]: { ...prev[queueKey], activeViewBaseFilters: filters } }));
  }, []);

  const getAppliedFilters = useCallback((queueKey: QueueKey) => state[queueKey]?.appliedFilters ?? null, [state]);

  const setAppliedFilters = useCallback((queueKey: QueueKey, updater: Updater<FilterState | null>) => {
    setState(prev => ({
      ...prev,
      [queueKey]: { ...prev[queueKey], appliedFilters: resolveUpdater(updater, prev[queueKey]?.appliedFilters ?? null) },
    }));
  }, []);

  return (
    <CustomViewsContext.Provider value={{
      getViews, setViews,
      getPinnedSidebarViews, setPinnedSidebarViews,
      getActiveViewLabel, setActiveViewLabel,
      getActiveViewBaseFilters, setActiveViewBaseFilters,
      getAppliedFilters, setAppliedFilters,
    }}>
      {children}
    </CustomViewsContext.Provider>
  );
}
