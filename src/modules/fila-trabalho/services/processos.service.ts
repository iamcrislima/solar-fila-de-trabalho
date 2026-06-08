import { getProcessosWorkQueueCards } from '../selectors/processoQueue.selectors';
import type { WorkQueueCard } from '../types';

/** Retorna os processos formatados para exibição na fila de trabalho. */
export function getProcessosParaFila(): WorkQueueCard[] {
  return getProcessosWorkQueueCards();
}
