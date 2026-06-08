import type { Tarefa, TarefaStatusAtribuicao, TarefaSituacao } from '../models/tarefa.model';

export function getTarefaProcessoId(tarefa: Tarefa | null | undefined): string | null {
  return tarefa?.processoId ?? null;
}

export function getTarefaTitulo(tarefa: Tarefa | null | undefined): string {
  return tarefa?.titulo ?? '';
}

export function getTarefaStatus(tarefa: Tarefa | null | undefined): TarefaStatusAtribuicao | '' {
  return tarefa?.statusAtribuicao ?? tarefa?.status ?? '';
}

export function isTarefaAtribuida(tarefa: Tarefa | null | undefined): boolean {
  return getTarefaStatus(tarefa) === 'atribuida';
}

export function isTarefaAgendada(tarefa: Tarefa | null | undefined): boolean {
  return !!tarefa?.agendamento?.agendada;
}

export function getTarefaSituacao(tarefa: Tarefa | null | undefined): TarefaSituacao {
  return tarefa?.situacao ?? 'em_aberto';
}

export function isTarefaAberta(tarefa: Tarefa | null | undefined): boolean {
  return getTarefaSituacao(tarefa) === 'em_aberto';
}
