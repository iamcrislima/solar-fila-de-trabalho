import { useMemo } from 'react';
import { getTarefasParaFila } from '../services/tarefas.service';
import type { WorkQueueCard } from '../types';

/**
 * Hook de dados da fila de tarefas.
 * Fase 2 (Services): wraps the service with useMemo.
 * Fase 3 (React Query): substituir por useQuery({ queryFn: getTarefasParaFila }).
 */
export function useTarefas(): WorkQueueCard[] {
  return useMemo(() => getTarefasParaFila(), []);
}
