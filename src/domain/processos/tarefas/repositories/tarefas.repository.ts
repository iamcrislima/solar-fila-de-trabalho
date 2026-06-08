import type { Tarefa } from '../models/tarefa.model';
import { tarefasMock } from '../mocks/tarefas.mock';

export function isTarefaEmAndamento(tarefa: Tarefa): boolean {
  return (tarefa as unknown as { emAndamento?: boolean })?.emAndamento !== false;
}

// RN-FT-08: tarefa visível se responsaveis contém o nome do usuário ou sua unidade.
export function isTarefaVisivelParaUsuario(
  tarefa: Tarefa,
  nomeUsuario: string,
  unidade: string
): boolean {
  const partes = (tarefa?.dados?.responsaveis ?? '').split(',').map((s) => s.trim());
  return partes.includes(nomeUsuario) || partes.includes(unidade);
}

export function getTarefas(): Tarefa[] {
  return tarefasMock;
}

export function getTarefasEmAndamento(): Tarefa[] {
  return getTarefas().filter(isTarefaEmAndamento);
}

export function getTarefasVisiveis(nomeUsuario: string, unidade: string): Tarefa[] {
  return getTarefasEmAndamento().filter((t) =>
    isTarefaVisivelParaUsuario(t, nomeUsuario, unidade)
  );
}

export function getTarefaById(tarefaId: string): Tarefa | null {
  return getTarefas().find((t) => t.id === tarefaId) ?? null;
}

export function getTarefasByProcessoId(processoId: string): Tarefa[] {
  if (!processoId) return [];
  return getTarefasEmAndamento().filter((t) => t.processoId === processoId);
}
