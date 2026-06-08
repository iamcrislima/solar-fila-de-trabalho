import { useMemo } from 'react';
import { getProcessosParaFila } from '../services/processos.service';
import type { WorkQueueCard } from '../types';

/**
 * Hook de dados da fila de processos.
 * Fase 2 (Services): wraps the service with useMemo.
 * Fase 3 (React Query): substituir por useQuery({ queryFn: getProcessosParaFila }).
 */
export function useProcessos(): WorkQueueCard[] {
  return useMemo(() => getProcessosParaFila(), []);
}
