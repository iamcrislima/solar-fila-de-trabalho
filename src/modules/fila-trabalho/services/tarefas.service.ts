import { getTarefasWorkQueueCards } from '../selectors/tarefaQueue.selectors';
import type { WorkQueueCard } from '../types';

/** Retorna as tarefas formatadas para exibição na fila de trabalho. */
export function getTarefasParaFila(): WorkQueueCard[] {
  return getTarefasWorkQueueCards();
}
