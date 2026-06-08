import { createContext, useContext } from 'react';
import type { Tarefa, TarefaStatusAtribuicao } from '@/domain/processos/tarefas/models/tarefa.model';

export interface TarefaAssignment {
  statusAtribuicao: TarefaStatusAtribuicao;
  atribuidoA: string;
  data: string;
}

export interface TarefasContextValue {
  assignmentMap: Map<string, TarefaAssignment>;
  getTarefaAssignment: (tarefaOrId: Tarefa | string) => TarefaAssignment;
  isTarefaAtribuida: (tarefaOrId: Tarefa | string) => boolean;
  atribuirTarefa: (tarefaOrId: Tarefa | string) => void;
  desatribuirTarefa: (tarefaOrId: Tarefa | string) => void;
  toggleTarefaAtribuicao: (tarefaOrId: Tarefa | string) => void;
  mergeTarefaAssignment: (tarefa: Tarefa | null) => Tarefa | null;
}

export const TarefasContext = createContext<TarefasContextValue | null>(null);

export function useTarefasState(): TarefasContextValue {
  const context = useContext(TarefasContext);
  if (!context) throw new Error('useTarefasState deve ser usado dentro de TarefasProvider.');
  return context;
}
